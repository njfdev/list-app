import { Clerk, withAuth, WithAuthProp } from "@clerk/nextjs/api";
import { NextApiRequest, NextApiResponse } from "next";
import Pusher, { PresenceChannelData } from "pusher";

const handler = withAuth(async (
    req: WithAuthProp<NextApiRequest>,
    res: NextApiResponse
) => { 
    if (req.method === 'POST') {
        const { userId, getToken } = req.auth;
        const sockedId = req.body.socket_id;
        const channel = req.body.channel_name;
        
        const list_id = channel.replace(/^(presence-list-)/, '');

        const list = await prisma?.todoList.findUniqueOrThrow({
            where: {
                id: list_id,
            }
        })

        if (list?.owner_id !== userId) {
            res.send(403);
            return;
        }

        const userToken = await Clerk.verifyToken(await getToken({ template: "pusher" }) || '');

        interface userInfo {
            first_name: string;
            last_name: string;
        }

        const precenseData: PresenceChannelData = {
        // @ts-ignore
            user_id: userToken.id || '',
            user_info: {
                first_name: userToken.first_name,
                last_name: userToken.last_name,
            },
        }

        const pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID || '',
            key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
            secret: process.env.PUSHER_SECRET || '',
            cluster: process.env.PUSHER_CLUSTER || '',
            useTLS: true,
        })
        const authResponse = pusher.authorizeChannel(sockedId, channel, precenseData);

        res.send(authResponse);
        return;
    }
});

export default handler;