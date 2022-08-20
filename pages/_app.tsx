import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import PageLayout from 'components/Layouts/PageLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ClerkProvider>
  );
}

export default MyApp
