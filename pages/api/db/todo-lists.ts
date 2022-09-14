import type {NextApiRequest, NextApiResponse} from 'next'
import {withAuth, WithAuthProp} from "@clerk/nextjs/api";
import prisma from "lib/prisma";

type ResponseData = {
    message: string,
    data?: any,
}

const CreateTodoList = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;
    const {title} = req.body;

    if (!userId) {
        res.status(401).json({message: "Please login to create a todo list."})
        return;
    }

    if (!title) {
        res.status(400).json({message: "Please provide a title for your list."})
        return;
    }

    try {
        const list = await prisma.todoList.create({
            data: {
                owner_id: userId,
                title,
            },
        });

        res.redirect(`/list?id=${list.id}`);
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when creating your list, please try again."});
        return;
    }
}

const GetAllTodoLists = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;

    if (!userId) {
        res.status(401).json({message: "Please login to get your todo lists."})
        return;
    }

    try {
        const data = await prisma.todoList.findMany({
            where: {
                owner_id: userId,
            },
        });

        res.status(201).json({message: 'Todo lists have been fetch successfully.', data});
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when getting your lists, please try again."});
        return;
    }
}

const DeleteTodoList = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;
    const {list_id} = JSON.parse(req.body);

    if (!userId) {
        res.status(401).json({message: "Please login to delete your todo list."})
        return;
    }

    if (!list_id) {
        res.status(400).json({message: "Please provide a todo list to delete."})
        return;
    }

    try {
        // We use deleteMany because otherwise we can't specify owner_id due to it not being unique. This should only ever
        const data = await prisma.todoList.deleteMany({
            where: {
                id: list_id,
                owner_id: userId,
            },
        });

        res.status(201).json({message: 'Todo list has been deleted successfully.', data});
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when deleting your list, please try again."});
        return;
    }
}

const UpdateTodoListTitle = async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse<ResponseData>
) => {
    const {userId} = req.auth;
    const {list_id, title} = req.body;

    if (!userId) {
        res.status(401).json({message: "Please login to update your todo list."})
        return;
    }

    if (!list_id || !title) {
        res.status(400).json({message: "Please provide both the id of the list you want to update and the title the change it to. (list_id, title)"})
    }

    try {
        // We use deleteMany because otherwise we can't specify owner_id due to it not being unique. This should only ever
        const data = await prisma.todoList.updateMany({
            where: {
                id: list_id,
                owner_id: userId,
            },
            data: {
                title,
            },
        });

        res.status(201).json({message: 'Todo list has been updated successfully.', data});
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({message: "An error occurred when updating your list, please try again."});
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
    if (req.method === 'GET') {
        await GetAllTodoLists(req, res);
        return;
    }
    if (req.method === 'DELETE') {
        await DeleteTodoList(req, res);
    }
    if (req.method === 'PATCH') {
        await UpdateTodoListTitle(req, res);
        return;
    }
});

export default handler;