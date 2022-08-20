import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NJF Lists</title>
      </Head>

      <SignedIn>
        <h1>You are signed in.</h1>
      </SignedIn>
      <SignedOut>
        <h1>You are signed out.</h1>
      </SignedOut>
    </div>
  )
}

export default Home
