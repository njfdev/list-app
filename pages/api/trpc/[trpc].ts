import { withAuth } from "@clerk/nextjs/api";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import {NextApiRequest} from "next";
import {LooseAuthProp} from "@clerk/clerk-sdk-node/dist/Clerk";
import prisma from "../../../lib/prisma";
import {inferAsyncReturnType} from "@trpc/server";

export const appRouter = trpc
    .router<Context>()
    .query("get-all-lists", {
        async resolve({ctx}) {
            // @ts-ignore
            const {userId} = ctx.req.auth;

            if (!userId) {
                return {
                    noAuth: true,
                    lists: undefined
                }
            }

            const lists = await prisma.list.findMany({
                where: {
                    owner_id: userId
                }
            });

            return {
                noAuth: false,
                lists
            }
        },
    })
    .query("get-list", {
        input: z
            .object({
                id: z.string(),
            }),
        async resolve({ ctx, input }) {
            const list_id = input.id;
            const userId = ctx.req?.auth?.userId;

            const list = await prisma.list.findUniqueOrThrow({
                where: {
                    id: list_id,
                },
                select: {
                    title: true,
                    id: true,
                    owner_id: true,
                    todos: true,
                    type: true,
                    editors: true,
                    description: true,
                }
            });

            if (list.owner_id !== userId) {
                return {
                    notAuthorized: true,
                }
            }

            return {
                list
            }
        }
    });

export type AppRouter = typeof appRouter;

export type optsWithAuth = Omit<trpcNext.CreateNextContextOptions, 'req'> & {
    req: NextApiRequest & LooseAuthProp;
};

async function createContext(opts?: optsWithAuth) {
    return {
        req: opts?.req,
        res: opts?.res
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;

export default withAuth(
    // @ts-ignore
    trpcNext.createNextApiHandler({
        router: appRouter,
        // @ts-ignore
        createContext,
        batching: {
            enabled: true
        }
    })
);