import {GetServerSideProps, InferGetServerSidePropsType, NextPage} from "next";
import prisma from "lib/prisma";
import {withServerSideAuth} from "@clerk/nextjs/ssr";
import {TodoItem, TodoList} from "@prisma/client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import Pusher from "pusher-js";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "./api/trpc/[trpc]";

export const getServerSideProps: GetServerSideProps = withServerSideAuth(async (ctx) => {
    const list_id = ctx.query.id;

    if (typeof list_id !== "string") {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    const ssr = await createSSGHelpers({
        router: appRouter,
        // @ts-ignore
        ctx
    });

    const listQuery = await ssr.fetchQuery(
        "get-list",
        {
            id: list_id,
        }
    );

    if (listQuery.notAuthorized) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }

    return {
        props: {
            list: listQuery.list
        },
    }
});

const List: NextPage = ({list}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    if (list) {
        const [tasks, setTasks] = useState<TodoItem[]>(list.todos);
        const [users, setUsers] = useState<any[]>([]);

        const router = useRouter();

        const deleteList = async () => {
            const res = await fetch('/api/db/todo-lists', {
                method: 'DELETE',
                body: JSON.stringify({list_id: list.id}),
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
            const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
                channelAuthorization: {
                    endpoint: "/api/pusher/auth",
                    transport: "ajax"
                }
            });
            const channel = pusher.subscribe(`presence-list-${list.id}`);

            channel.bind("pusher:subscription_succeeded", function () {
                let members: any[] = [];
                console.log("df");

                // @ts-ignore
                channel.members.each((member) => {
                    members.push(member);
                })

                setUsers(members);
            })

            channel.bind("task-updated", (data: { id: string, completed: boolean }) => {
                const task_index = tasks.findIndex((task => task.id === data.id));
                let updated_tasks = [...tasks];
                let updated_task = tasks[task_index];
                updated_task.completed = data.completed;
                updated_tasks[task_index] = updated_task;

                setTasks(updated_tasks);
            })
        }, []);

        return (
            <div>
                <h1>{list.title}</h1>
                <button onClick={deleteList}>Delete List</button>
                <Link href={`/new-todo?id=${list.id}`}><a>Create New Todo</a></Link>

                <h2>Viewers</h2>
                <ol>
                    {users.map((member) => {
                        return <li key={member.id}>{member.info.first_name} {member.info.last_name}</li>
                    })}
                </ol>

                <h2>Tasks</h2>
                <ol>
                    {tasks.map((task: TodoItem) => {
                        return (
                            <li key={task.id}>
                                <label htmlFor={`checkbox-${task.id}`}>{task.task}</label>
                                <input id={`checkbox-${task.id}`} type="checkbox" checked={task.completed}
                                       onChange={() => clickCheckBox(task)}/>
                            </li>
                        )
                    })}
                </ol>
            </div>
        )
    } else {
        return <h1>loading</h1>
    }
}

export default List;