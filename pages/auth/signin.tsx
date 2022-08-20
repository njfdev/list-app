import { SignIn } from "@clerk/nextjs";
import { NextPage } from "next";
import style from "styles/SignInPage.module.css"

const SignInPage: NextPage = () => {
    return (
        <div className={style.container}>
            <SignIn />
        </div>
    )
}

export default SignInPage;