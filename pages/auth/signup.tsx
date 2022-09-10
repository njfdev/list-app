import AuthPage from "components/pages/Auth";
import { AuthType } from "lib/types";
import { NextPage } from "next";
import style from "styles/SignUpPage.module.css"

const SignUpPage: NextPage = () => {
    return (
        <AuthPage type={AuthType.SignUp} />
    )
}

export default SignUpPage;