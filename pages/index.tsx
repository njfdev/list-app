import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Dashboard from 'components/pages/Dashboard'
import SignInPrompt from 'components/SignInPrompt'
import { GetServerSideProps } from "next";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import prisma from 'lib/prisma'
import { ListsProp } from 'lib/types'

export const getServerSideProps: GetServerSideProps = withServerSideAuth(async ({ req, resolvedUrl }) => {
  const { userId } = req.auth;

  if (!userId) {
    return {
        props: {}
    }
  }

  const lists = await prisma.todoList.findMany({
    where: { 
      owner_id: userId
    },
    select: {
      id: true,
      title: true,
    },
  });

  return {
    props: {
      lists,
    }
  }
});

const Home: NextPage<ListsProp> = ({ lists }) => {
  return (
    <div>
      <Head>
        <title>NJF Lists</title>
      </Head>

      <SignedIn>
        <Dashboard lists={lists} />
      </SignedIn>
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
    </div>
  )
}

export default Home
