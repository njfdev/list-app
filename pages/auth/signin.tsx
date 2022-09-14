import AuthPage from "components/pages/Auth";
import {AuthType} from "lib/types";
import {NextPage} from "next";

const SignInPage: NextPage = () => {
    return (
        <AuthPage type={AuthType.SignIn}/>
    )
}

export default SignInPage;