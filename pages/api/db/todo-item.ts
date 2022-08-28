import type { NextApiRequest, NextApiResponse } from 'next'
import { withAuth, WithAuthProp } from "@clerk/nextjs/api";
import prisma from "lib/prisma";

type ResponseData = {
  message: string,
  data?: any,
}

const CreateTodoList = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const { userId } = req.auth;
    const { task, list_id } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Please login to create a todo list." })
        return;
    }

    if (!task) {
        res.status(400).json({ message: "Please provide a task for your todo." })
        return;
    }

    try {
        const list = await prisma.todoList.findUniqueOrThrow({
            where: {
                id: list_id,
            }
        });

        if (list.owner_id !== userId) {
            res.status(401).json({ message: "You do not have permission to do this." });
            return;
        }

        // User owns provided list
        await prisma.todoItem.create({
            data: {
                task,
                list: {
                    connect: { id: list_id },
                },
            },
        })

        res.redirect(`/list?id=${list_id}`);
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "An error occurred when creating your list, please try again." });
        return;
    }
}

const handler = withAuth(async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => { 
    if (req.method === 'POST') {
        await CreateTodoList(req, res);
        return;
    }
});

export default handler;