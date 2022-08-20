import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { NextPage } from 'next'
import Head from 'next/head'
import Dashboard from '../components/pages/Dashboard'
import SignInPrompt from '../components/SignInPrompt'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NJF Lists</title>
      </Head>

      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
    </div>
  )
}

export default Home
