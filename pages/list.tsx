import { GetServerSideProps, NextPage } from "next";
import prisma from "lib/prisma";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { TodoList } from "@prisma/client";

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

    return {
        props: {
            list,
        },
    }
});

interface ListProp {
    list: TodoList;
}

const List: NextPage<ListProp> = ({ list }) => {
    const deleteList = async () => {
        const res = await fetch('/api/db/todo-lists', {
            method: 'DELETE',
            body: JSON.stringify({ list_id: list.id }),
        })

        console.log(res, await res.json())
    }

    return (
        <div>
            <h1>{list.title}</h1>
            <button onClick={deleteList}>Delete List</button>
        </div>
    )
}

export default List;