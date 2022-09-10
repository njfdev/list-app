import { mdiPlusCircle, mdiCartOutline, mdiFormatListBulleted } from '@mdi/js';
import style from "./Auth.module.css";
import Icon from "@mdi/react";
import Link from "next/link";
import { AuthProp, AuthType, ListsProp } from 'lib/types';
import { NextPage } from 'next';
import { AuthenticateWithRedirectCallback, RedirectToUserProfile, SignedIn, SignedOut, UserButton, useSignIn, useSignUp, useUser } from '@clerk/nextjs';
import React, { Children, DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SiApple, SiGoogle, SiMicrosoft } from 'react-icons/si';
import { IconType } from 'react-icons';
import { IoMdArrowRoundBack } from 'react-icons/io'
import { OAuthStrategy } from '@clerk/backend-core';

const AuthPage: NextPage<AuthProp> = ({ type }) => {
    const router = useRouter();

    let action = "";
    let actionCaps = "";
    let auth = null;

    if (type === AuthType.SignUp) {
        action = "Sign up";
        actionCaps = "Sign Up";
        auth = useSignUp();
    } else if (type === AuthType.SignIn) {
        action = "Sign in";
        actionCaps = "Sign In";
        auth = useSignIn();
    }

    return (
        <>
            <div id={style.backButton} onClick={() => {router.push("/")}}><IoMdArrowRoundBack /> <span>Back</span></div>
            <SignedOut>
                <div className={style.container}>
                    <div id={style.infoText}>
                        <h1>{actionCaps}</h1>
                        <h2>Create a new account for njf lists.</h2>
                    </div>
                    <AuthProviders action={action} auth={auth} type={type} />
                    <div id={style.dividerContainer}>
                        <hr/>
                        <span>or</span>
                        <hr/>
                    </div>
                    <div id={style.manualAuthContainer}>
                        {type === AuthType.SignUp && <AuthInput placeholder='John Doe'>Full Name</AuthInput>}
                        <AuthInput type="email" placeholder='example@mail.com'>Email</AuthInput>
                        <AuthInput type="password" placeholder='At least 8 characters'>Password</AuthInput>
                        <input id={style.submitButton} type="submit" value={actionCaps} />
                    </div>
                </div>
            </SignedOut>
            <SignedIn>
                <RedirectToUserProfile />
            </SignedIn>
        </>
    )
}

interface ProviderType {
    name: string;
    icon: IconType;
    strategy: OAuthStrategy;
}

const AuthProviders: NextPage<{ action: string, auth: any, type: AuthType }> = ({ action, type, auth }) => {
    const providers: ProviderType[] = [
        { name: "Apple", icon: SiApple, strategy: "oauth_apple" },
        { name: "Google", icon: SiGoogle, strategy: "oauth_google" },
        { name: "Microsoft", icon: SiMicrosoft, strategy: "oauth_microsoft" },
    ]

    const handleSocialAuth = (authStrategy: OAuthStrategy) => {
        const authAction = type === AuthType.SignUp ?
            auth.signUp :
            auth.signIn;

        return authAction.authenticateWithRedirect({
            strategy: authStrategy,
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
        });
    }

    return (
        <div id={style.authProviders}>
            {providers.map((provider) => {
                return (
                    <AuthButton
                        action={action}
                        provider={provider.name}
                        providerIcon={provider.icon}
                        key={provider.name} 
                        onClick={() => handleSocialAuth(provider.strategy)}/>
                )
            })}
        </div>
    )
}

const AuthButton: NextPage<{ action: string, provider: string, providerIcon: IconType, key: string, onClick: React.MouseEventHandler<HTMLDivElement> }> = ({ action, provider, providerIcon, key, onClick }) => {
    return (
        <div className={style.authButton} key={key} onClick={onClick}>
            {providerIcon({ size: "2rem" })}
            <span>{action} with {provider}</span>
        </div>
    )
}

const AuthInput: NextPage<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = ({ children, placeholder, type }) => {
    return (
        <div className={style.inputContainer}>
            <h3>{children}</h3>
            <input type={type} placeholder={placeholder} />
        </div>
    )
}

export default AuthPage;