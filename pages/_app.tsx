import 'styles/globals.css';
import 'styles/clerk.css';
import type {AppProps} from 'next/app'
import {ClerkProvider, useAuth, useUser} from '@clerk/nextjs'
import PageLayout from 'components/Layouts/PageLayout';
import {init} from '@socialgouv/matomo-next'
import {useEffect} from 'react';
import Head from 'next/head';
import Tracker from "@openreplay/tracker";
import {AppRouter} from "pages/api/trpc/[trpc]";
import {withTRPC} from "@trpc/next";
import {H} from "highlight.run";
import {NextPage} from "next";
import {ErrorBoundary} from "@highlight-run/react";
import * as Sentry from "@sentry/nextjs";

export { reportWebVitals } from 'next-axiom';

// Using the or operator so Typescript doesn't complain because env variables might be undefined sometimes
const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL || '';
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || '';

if (process.env.NODE_ENV !== "development") {
    H.init(process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
        tracingOrigins: true,
        networkRecording: {
            enabled: true,
            recordHeadersAndBody: true
        },
        environment: process.env.VERCEL_ENV === "production" ?
            "production" :
            "staging",
    });

    H.getSessionURL().then(sessionUrl => {
        Sentry.setContext("highlight", {
            "url": sessionUrl
        })
    })
}

const tracker = new Tracker({
    projectKey: process.env.NEXT_PUBLIC_OPEN_REPLAY_PROJECT_KEY || '',
    __DISABLE_SECURE_MODE: process.env.NODE_ENV === "development",
});

function MyApp({Component, pageProps}: AppProps) {
    let hasRun = false;

    useEffect(() => {
        if (!hasRun) {
            init({url: MATOMO_URL, siteId: MATOMO_SITE_ID});

            tracker.start();

            hasRun = true;
        }
    }, []);

    return (
        <ErrorBoundary>
            <ClerkProvider>
                <Head>
                    <meta name='viewport' content='initial-scale=1, viewport-fit=cover'/>
                </Head>

                <AuthStateHandler/>

                <Component {...pageProps} />
            </ClerkProvider>
        </ErrorBoundary>
    );
}

const AuthStateHandler: NextPage = () => {
    const user = useUser();

    useEffect(() => {
        if (user.isSignedIn) {
            H.identify(user?.user?.primaryEmailAddress?.emailAddress ?? "", {
                id: user.user.id,
                first_name: user.user.firstName ?? "",
                last_name: user.user.lastName ?? "",
                avatar: user.user.profileImageUrl
            })
        }
    }, [user]);

    return <></>;
}

export default withTRPC<AppRouter>({
    config({ ctx }) {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`;
        console.log(url);

        return {
            url
        };
    }
})(MyApp);
