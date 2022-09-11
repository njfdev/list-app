import { mdiPlusCircle, mdiCartOutline, mdiFormatListBulleted } from '@mdi/js';
import style from "./Auth.module.css";
import Icon from "@mdi/react";
import Link from "next/link";
import { AuthProp, AuthType, ListsProp } from 'lib/types';
import { NextPage } from 'next';
import { AuthenticateWithRedirectCallback, RedirectToUserProfile, SignedIn, SignedOut, UserButton, useSignIn, useSignUp, useUser } from '@clerk/nextjs';
import React, { Children, DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactEventHandler, ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SiApple, SiGoogle, SiMicrosoft } from 'react-icons/si';
import { IconType } from 'react-icons';
import { IoMdArrowRoundBack } from 'react-icons/io'
import { OAuthStrategy } from '@clerk/backend-core';
import { ClerkAPIError } from '@clerk/types';
import readingTime from "reading-time";

interface AuthProps {
    name: string;
    email: string;
    password: string;
}

interface Numbers {
    digit0: number | null;
    digit1: number | null;
    digit2: number | null;
    digit3: number | null;
    digit4: number | null;
    digit5: number | null;
}

const emptyCode: Numbers = {
    digit0: null, 
    digit1: null, 
    digit2: null, 
    digit3: null, 
    digit4: null, 
    digit5: null
}

enum CodeStatus {
    Success,
    Error,
}

const AuthPage: NextPage<AuthProp> = ({ type }) => {
    const [form, setForm] = useState<AuthProps>({ name: "", email: "", password: "" });
    const [code, setCode] = useState<Numbers>(emptyCode);
    const [error, setError] = useState<string | null>(null);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [signUpAttempt, setSignUp] = useState(null);
    const [codeStatus, setCodeStatus] = useState<CodeStatus | null>(null);

    const digit0Ref = useRef();

    const router = useRouter();

    let action = "";
    let actionCaps = "";
    let auth: any = null;

    if (type === AuthType.SignUp) {
        action = "Sign up";
        actionCaps = "Sign Up";
        auth = useSignUp();
    } else if (type === AuthType.SignIn) {
        action = "Sign in";
        actionCaps = "Sign In";
        auth = useSignIn();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        const name = target.name;

        setForm({
            ...form,
            [name]: target.value,
        })
    }

    const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (type === AuthType.SignUp) {
            setError(null);

            const [firstName, lastName] = form.name.split(' ');

            try {
                setSignUp(null);

                const signUpAttempt = await auth.signUp.create({
                    firstName,
                    lastName,
                    email_address: form.email,
                    password: form.password,
                });

                const emailVerification = await signUpAttempt.prepareEmailAddressVerification();
                setSignUp(emailVerification);
            } catch (e) {
                setError((e as { errors: ClerkAPIError[] }).errors[0].message);
            }
        } else if (type === AuthType.SignIn) {
            try {
                const res = await auth.signIn.create({
                    identifier: form.email,
                    password: form.password,
                })
                auth.setSession(res.createdSessionId, () => { router.push("/") });
            } catch (e) {
                console.log(e)
            }
        } else {
            throw "Can't handle auth due to auth type not being set";
        }
    }

    const handleBackButton = () => {
        if (signUpAttempt) {
            setSignUp(null);
            setCode(emptyCode);
        } else {
            router.push("/");
        }
    }

    useEffect(() => {
        (async () => {
            const isCodeComplete = !Object.values(code).some(x => x === null);

            if (isCodeComplete) {
                setDisabled(true);

                let stringCode = "";
                Object.keys(code).forEach(key => {
                    stringCode += code[key as keyof typeof code]?.toString();
                })

                let numberCode = parseInt(stringCode);

                try {
                    if (signUpAttempt) {
                        // @ts-ignore
                        const signUpVerification = await signUpAttempt.attemptEmailAddressVerification({ code: numberCode.toString() });
                        setCodeStatus(CodeStatus.Success);

                        await new Promise(callback => setInterval(callback, 1500));

                        auth.setSession(signUpVerification.createdSessionId, () => { router.push("/") });
                    } else {
                        throw "SignUpAttempt object is null"; 
                    }
                } catch (e) {
                    const error = (e as { errors: ClerkAPIError[] }).errors[0];
                    
                    setVerifyError(error.longMessage || null);
                    setCodeStatus(CodeStatus.Error);

                    await new Promise(callback => setTimeout(callback, readingTime(error.longMessage || "").time + 500));

                    setVerifyError(null);
                    setCodeStatus(null)
                    setCode(emptyCode);
                    setDisabled(false);
                }
            }
        })()
    }, [code])

    useEffect(() => {
        if (!disabled) {
            // @ts-ignore
            digit0Ref.current?.focus();
        }
    }, [disabled])

    return (
        <>
            <div id={style.backButton} onClick={handleBackButton}><IoMdArrowRoundBack /> <span>Back</span></div>
            <br />
            <SignedOut>
                {!signUpAttempt &&
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
                        <form onSubmit={handleAuthAction} id={style.manualAuthContainer}>
                            {type === AuthType.SignUp && <AuthInput placeholder='John Doe' id="name" name="name" pattern="^[a-zA-Z]+ [a-zA-Z]+$" value={form.name} onChange={handleInputChange}>Full Name</AuthInput>}
                            <AuthInput type="email" placeholder='example@mail.com' id="email" name="email" value={form.email} onChange={handleInputChange}>Email</AuthInput>
                            <AuthInput type="password" placeholder='At least 8 characters' id="password" name="password" value={form.password} onChange={handleInputChange}>Password</AuthInput>
                            {error && <span id={style.errorMessage}>{error}</span>}
                            <input id={style.submitButton} type="submit" value={actionCaps} />
                        </form>
                    </div> ||
                    <div className={style.container}>
                        <h1>Verify Your Email</h1>
                        <h2>Enter the code sent to your email.</h2>
                        <div id={style.authCodeContainer}>
                            {
                                Array.from(Array(6).keys()).map((number) => {
                                    const indexValue = `digit${number.toString()}` as keyof typeof code;

                                    // @ts-ignore
                                    return <input ref={number === 0 ? digit0Ref : undefined}
                                        autoFocus={number === 0} disabled={disabled}
                                        pattern='\d*'
                                        id={indexValue}
                                        key={number}
                                        className={style.authCodeInput}
                                        // @ts-ignore
                                        value={code[indexValue] !== null ? code[indexValue] : ""}
                                        style={{ borderColor: codeStatus !== null ? codeStatus === CodeStatus.Success ? "#00bb00" : "red" : "transparent" }}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            e.preventDefault();

                                            const codeNumber = parseInt(e.target.value);
                                            
                                            if (Number.isNaN(codeNumber)) {
                                                setCode({ ...code, [indexValue]: null });
                                                return;
                                            };

                                            const additions = codeNumber.toString().slice(code[indexValue]?.toString.length);
                                            
                                            if (additions.length > 1) {
                                                let newCode = code;
                                                let digitIndex = number;
                                                for (let i = 0; i < additions.length; i++) {
                                                    if (digitIndex <= 6) {
                                                        newCode[`digit${digitIndex}` as keyof typeof code] = parseInt(additions[i]);
                                                        digitIndex++;
                                                    }
                                                }

                                                setCode({ ...newCode });
                                                document.getElementById(`digit${digitIndex === 7 ? 6 : digitIndex}`)?.focus();
                                                return;
                                            }

                                            const afterValue = codeNumber.toString().length <= 1 ? codeNumber : parseInt(codeNumber.toString().slice(1,2));
                                            setCode({ ...code, [indexValue]: afterValue });

                                            if (!/^[0-9]+$/.test(e.target.value)) { return; }
                                            // @ts-ignore
                                            e.target.nextElementSibling?.focus();
                                        }} 
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === "Backspace" && code[indexValue] === null) {
                                                // @ts-ignore
                                                e.target.previousSibling?.focus();
                                            } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                                                e.preventDefault();
                                                // @ts-ignore
                                                e.target.nextElementSibling?.focus();
                                            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                                                e.preventDefault();
                                                // @ts-ignore
                                                e.target.previousSibling?.focus();
                                            }
                                        }}
                                        onMouseDown={(e: React.MouseEvent<HTMLInputElement>) => {
                                            e.preventDefault();
                                            e.currentTarget.focus()
                                            e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
                                        }} />
                                })
                            }
                        </div>
                        <p id={style.verifyErrorText}>{verifyError}</p>
                    </div>
                }
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

const AuthInput: NextPage<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>> = ({ children, placeholder, type, id, value, onChange, name, pattern }) => {
    return (
        <div className={style.inputContainer}>
            <label htmlFor={id}>{children}</label>
            <input id={id} type={type} minLength={type === "password" ? 8 : undefined} placeholder={placeholder} value={value} onChange={onChange} name={name} required pattern={pattern} />
        </div>
    )
}

export default AuthPage;