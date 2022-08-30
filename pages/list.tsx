import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { TodoItem, TodoList } from "@prisma/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Pusher from "pusher-js";

export const getServerSideProps: GetServerSideProps = withServerSideAuth(async (context) => {
    const id = context.query.id;
    const { userId } = context.req.auth;

    if (!id || typeof(id) !== 'string') {
        return {
            notFound: true,
        }
    }

    const list = await prisma.todoList.findUniqueOrThrow({
        where: {
            id,
        },
    })

    if (list.owner_id !== userId) {
        return {
            props: {
                notAuthorized: true,
            },
        }
    }

    // User owns list
    const { todos } = await prisma.todoList.findUniqueOrThrow({
        where: {
            id,
        },
        select: {
            todos: true,
        }
    })

    return {
        props: {
            list,
            todos,
        },
    }
});

interface ListProp {
    list: TodoList;
    todos: any;
}

const List: NextPage<ListProp> = ({ list, todos }) => {
    const [tasks, setTasks] = useState<TodoItem[]>(todos);

    const router = useRouter();

    const deleteList = async () => {
        const res = await fetch('/api/db/todo-lists', {
            method: 'DELETE',
            body: JSON.stringify({ list_id: list.id }),
        });

        if (res.status === 201) {
            router.push('/');
            return;
        }
    }

    const fetchTasks = async () => {
        const res = await fetch("/api/db/todo-item", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                list_id: list.id,
            }),
        });

        const json = await res.json();

        setTasks(json.data);
    }

    const clickCheckBox = async (thisTask: TodoItem) => {
        // Make click appear instantly to give good user feedback
        const updatedTasks = tasks;
        const updatedThisTask = thisTask;
        updatedThisTask.completed = !thisTask.completed;
        updatedTasks[tasks.indexOf(thisTask)] = updatedThisTask;

        // TODO: Fix Bug - Have to stringify then parse because updatedTasks doesn't work
        setTasks(JSON.parse(JSON.stringify(updatedTasks)));

        const res = await fetch("/api/db/todo-item", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: thisTask.id,
                completed: updatedThisTask.completed,
            }),
        });

        // Fetch the actual tasks and show the result
        await fetchTasks();
    }

    useEffect(() => {
        console.log(tasks)
    }, [tasks])

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '');
    const channel = pusher.subscribe(`list-${list.id}`);
    channel.bind("task-updated", (data) => {
        const task_index = tasks.findIndex((task => task.id === data.id));
        let updated_tasks = [...tasks];
        let updated_task = tasks[task_index];
        updated_task.completed = data.completed;
        updated_tasks[task_index] = updated_task;

        setTasks(updated_tasks);
    })

    return (
        <div>
            <h1>{list.title}</h1>
            <button onClick={deleteList}>Delete List</button>
            <Link href={`/new-todo?id=${list.id}`}><a>Create New Todo</a></Link>
            <ol>
                {tasks.map((task: TodoItem) => {
                    return (
                        <li key={task.id}>
                            <label htmlFor={`checkbox-${task.id}`}>{task.task}</label>
                            <input id={`checkbox-${task.id}`} type="checkbox" checked={task.completed} onChange={() => clickCheckBox(task)} />
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

export default List;