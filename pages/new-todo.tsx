import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { GetServerSideProps, NextPage } from "next";
import prisma from 'lib/prisma';
import { TodoList } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = withServerSideAuth(async (context) => {
    const id = context.query.id;
    const { userId } = context.req.auth;

    if (!id || typeof(id) !== 'string' || !userId) {
        return {
            notFound: true,
        }
    }

    try {
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

        // User owns list and the list exists
        return {
            props: {
                list,
            },
        }
    } catch (e) {
        console.log(e);
        return {
            notFound: true,
        }
    }
});

interface ListProp {
    list: TodoList;
}

const CreateListPage: NextPage<ListProp> = ({ list }) => {
    return (
        <div>
            <h1>Create a New Todo for &quot;{list.title}&quot;</h1>
            <form action="/api/db/todo-item" method="POST">
                <label htmlFor="task">Todo Task:</label>
                <input id="task" name="task" />
                <br />
                <input hidden={true} value={list.id} name="list_id" />
                <input type="submit" value="Create Todo" />
            </form>
        </div>
    )
}

export default CreateListPage;