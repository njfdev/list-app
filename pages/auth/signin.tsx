import { SignIn } from "@clerk/nextjs";
import AuthPage from "components/pages/Auth";
import { AuthType } from "lib/types";
import { NextPage } from "next";
import style from "styles/SignInPage.module.css"

const SignInPage: NextPage = () => {
    return (
        <AuthPage type={AuthType.SignIn} />
    )
}

export default SignInPage;