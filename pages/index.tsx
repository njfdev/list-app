import {SignedIn, SignedOut} from '@clerk/nextjs'
import type {GetServerSideProps, InferGetServerSidePropsType, NextPage} from 'next'
import Head from 'next/head'
import Dashboard from 'components/pages/Dashboard'
import SignInPrompt from 'components/SignInPrompt'
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "./api/trpc/[trpc]";
import {withServerSideAuth} from "@clerk/nextjs/ssr";
import {ClerkLoaded, ClerkLoading} from "@clerk/clerk-react";

export const getServerSideProps: GetServerSideProps = withServerSideAuth(
    async (ctx) => {
        const ssr = await createSSGHelpers({
            router: appRouter,
            // @ts-ignore
            ctx
        });

        const listsQuery = await ssr.fetchQuery(
            "get-all-lists"
        );

        return {
            props: {
                lists: listsQuery.lists ?? [],
                noAuth: listsQuery.noAuth
            }
        }
    }
);

const Home: NextPage = ({ lists, noAuth }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <div>
            <Head>
                <title>NJF Lists</title>
            </Head>

            <ClerkLoaded>
                <SignedIn>
                    <Dashboard lists={lists} />
                </SignedIn>
                <SignedOut>
                    <SignInPrompt/>
                </SignedOut>
            </ClerkLoaded>

            <ClerkLoading>
                {noAuth &&
                    <SignInPrompt/> ||
                    <Dashboard lists={lists} />
                }
            </ClerkLoading>
        </div>
    )
}

export default Home
