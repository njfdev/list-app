import type {NextApiRequest, NextApiResponse} from 'next'
import {withAuth, WithAuthProp} from "@clerk/nextjs/api";
import prisma from "lib/prisma";

type ResponseData = {
    message: string,
    data?: any,
}

const CreateTodoItem = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;
    const {task, list_id} = req.body;

    if (!userId) {
        res.status(401).json({message: "Please login to create a todo list."})
        return;
    }

    if (!task) {
        res.status(400).json({message: "Please provide a task for your todo."})
        return;
    }

    try {
        const list = await prisma.list.findUniqueOrThrow({
            where: {
                id: list_id,
            }
        });

        if (list.owner_id !== userId) {
            res.status(401).json({message: "You do not have permission to do this."});
            return;
        }

        // User owns provided list
        await prisma.listTask.create({
            data: {
                task,
                list: {
                    connect: {id: list_id},
                },
            },
        })

        res.redirect(`/list?id=${list_id}`);
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when creating your list, please try again."});
        return;
    }
}

const UpdateTodoItem = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;
    const {id, completed} = req.body;

    if (!userId) {
        res.status(401).json({message: "Please login to update a todo list."})
        return;
    }

    if (!id || completed === undefined || completed === null) {
        res.status(400).json({message: "Please provide the id of the task to update and the value to update."})
        return;
    }

    try {
        await prisma.listTask.updateMany({
            where: {
                id,
                list: {
                    owner_id: userId,
                },
            },
            data: {
                completed,
            }
        });

        const Pusher = require("pusher");
        const pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.NEXT_PUBLIC_PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: process.env.PUSHER_CLUSTER,
            useTLS: true,
        })

        const task = await prisma.listTask.findUniqueOrThrow({
            where: {
                id,
            },
        })

        pusher.trigger(`presence-list-${task.list_id}`, "task-updated", {
            id, completed
        });

        res.status(200).json({message: "Task updated", data: {completed}});
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when creating your list, please try again."});
        return;
    }
}

const GetAllTodoItems = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;
    console.log(req.query)
    const {list_id} = req.body;

    if (!userId) {
        res.status(401).json({message: "Please login to update a todo list."})
        return;
    }

    if (!list_id) {
        res.status(400).json({message: "Please provide the list id to get the tasks from."})
        return;
    }

    try {
        const tasks = await prisma.listTask.findMany({
            where: {
                list_id
            },
        });

        res.status(200).json({message: "Tasks Retrieved", data: tasks});
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when creating your list, please try again."});
        return;
    }
}

const handler = withAuth(async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    if (req.method === 'POST') {
        await CreateTodoItem(req, res);
        return;
    }
    if (req.method === 'PUT') {
        await UpdateTodoItem(req, res);
        return;
    }
    // TODO: This is really a "GET" statement but "GET" doesn't allow us to pass the list variable to our function
    if (req.method === 'PATCH') {
        await GetAllTodoItems(req, res);
        return;
    }
});

export default handler;