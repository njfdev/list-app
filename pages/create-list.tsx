import {SignedIn, SignedOut} from "@clerk/nextjs";
import SignInPrompt from "components/SignInPrompt";
import CreateList from "components/pages/CreateList"

const CreateListPage = () => {
    return (
        <div>
            <SignedIn>
                <CreateList/>
            </SignedIn>
            <SignedOut>
                <SignInPrompt/>
            </SignedOut>
        </div>
    )
}

export default CreateListPage;