import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { TodoItem, TodoList } from "@prisma/client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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

    return (
        <div>
            <h1>{list.title}</h1>
            <button onClick={deleteList}>Delete List</button>
            <Link href={`/new-todo?id=${list.id}`}><a>Create New Todo</a></Link>
            <ol>
                {todos.map((task: TodoItem) => {
                    return (
                        <li key={task.id}>
                            <p>{task.task}</p>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

export default List;