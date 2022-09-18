import {NextPage} from "next";
import Link from "next/link";
import {useRouter} from "next/router";
import style from "./SignInPrompt.module.css";

const SignInPrompt: NextPage = () => {
    const router = useRouter();

    return (
        <div id={style.container}>
            <h1 id={style.title}>njf lists</h1>

            <div id={style.spacer}/>

            <button id={style.getStartedButton} onClick={() => router.push("/auth/signup")}>
                Get Started
            </button>
            <p id={style.bottomText}>Already have an account? <Link href="/auth/signin"><b id={style.signInButton}>Sign
                in</b></Link></p>

            <div suppressHydrationWarning style={{height: `calc(100vh - ${typeof window !== "undefined" ? document.documentElement.clientHeight + "px" : "100vh"})`}}/>
        </div>
    )
};

export default SignInPrompt;