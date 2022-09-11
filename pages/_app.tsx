import 'styles/globals.css';
import 'styles/clerk.css';
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import PageLayout from 'components/Layouts/PageLayout';
import { init } from '@socialgouv/matomo-next'
import { useEffect } from 'react';
import Head from 'next/head';
import Tracker from "@openreplay/tracker";

// Using the or operator so Typescript doesn't complain because env variables might be undefined sometimes
const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL || '';
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || '';

const tracker = new Tracker({
  projectKey: process.env.NEXT_PUBLIC_OPEN_REPLAY_PROJECT_KEY || '',
  __DISABLE_SECURE_MODE: process.env.NODE_ENV === "development",
});

function MyApp({ Component, pageProps }: AppProps) {
  let hasRun = false;

  useEffect(() => {
    console.log("lol")
    if (!hasRun) {
      init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });

      tracker.start();

      hasRun = true;
    }
  }, []);

  return (
    <ClerkProvider>
      <Head>
        <meta name='viewport' content='initial-scale=1, viewport-fit=cover'/>
      </Head>

      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
}

export default MyApp
