import { mdiPlusCircle, mdiCartOutline, mdiFormatListBulleted } from '@mdi/js';
import style from "./Auth.module.css";
import Icon from "@mdi/react";
import Link from "next/link";
import { AuthProp, AuthType, ListsProp } from 'lib/types';
import { NextPage } from 'next';
import { UserButton, useUser } from '@clerk/nextjs';
import { Children, DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SiApple, SiGoogle, SiMicrosoft } from 'react-icons/si';
import { IconType } from 'react-icons';
import { IoMdArrowRoundBack } from 'react-icons/io'

const AuthPage: NextPage<AuthProp> = ({ type }) => {
    const { user } = useUser();
    const router = useRouter();

    const actionCaps = type === AuthType.SignUp ? "Sign Up" : "Sign In";
    const action = type === AuthType.SignUp ? "Sign up" : "Sign in";

    return (
        <>
            <div id={style.backButton}><IoMdArrowRoundBack /> <span>Back</span></div>
            <div className={style.container}>
                <div id={style.infoText}>
                    <h1>{actionCaps}</h1>
                    <h2>Create a new account for njf lists.</h2>
                </div>
                <AuthProviders action={action} />
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
        </>
    )
}

interface ProviderType {
    name: string;
    icon: IconType;
}

const AuthProviders: NextPage<{ action: string }> = ({ action }) => {
    const providers: ProviderType[] = [
        { name: "Apple", icon: SiApple },
        { name: "Google", icon: SiGoogle },
        { name: "Microsoft", icon: SiMicrosoft },
    ]

    return (
        <div id={style.authProviders}>
            {providers.map((provider) => {
                return (
                    <AuthButton action={action} provider={provider.name} providerIcon={provider.icon} key={provider.name} />
                )
            })}
        </div>
    )
}

const AuthButton: NextPage<{ action: string, provider: string, providerIcon: IconType, key: string }> = ({ action, provider, providerIcon, key }) => {
    return (
        <div className={style.authButton} key={key}>
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