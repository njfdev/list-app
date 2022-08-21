import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import PageLayout from 'components/Layouts/PageLayout';
import { init } from '@socialgouv/matomo-next'
import { useEffect } from 'react';

// Using the or operator so Typescript doesn't complain because env variables might be undefined sometimes
const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL || '';
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || '';

function MyApp({ Component, pageProps }: AppProps) {
  let hasRun = false;

  useEffect(() => {
    if (!hasRun) {
      init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });

      hasRun = true;
    }
  }, []);

  return (
    <ClerkProvider>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
}

export default MyApp
