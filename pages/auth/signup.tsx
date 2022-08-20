import { SignUp } from "@clerk/nextjs";
import { NextPage } from "next";
import style from "styles/SignUpPage.module.css"

const SignUpPage: NextPage = () => {
    return (
        <div className={style.container}>
            <SignUp />
        </div>
    )
}

export default SignUpPage;