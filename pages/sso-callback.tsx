import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { NextPage } from "next";

const SSOCallback: NextPage = () => {
    return (
        <AuthenticateWithRedirectCallback />
    )
}

export default SSOCallback;