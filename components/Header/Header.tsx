import HeaderLayout from "components/Layouts/HeaderLayout"
import style from "./Header.module.css"
import HeaderLink from "./HeaderLink";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

const Header = () => {
    return (
        <HeaderLayout>
            <HeaderLink href="/">NJF Lists</HeaderLink>
            <SignedIn>
                <UserButton/>
            </SignedIn>
            <SignedOut>
                <div className={style.spacing}>
                    <HeaderLink href="/auth/signin">Sign In</HeaderLink>
                    <HeaderLink href="/auth/signup">Sign Up</HeaderLink>
                </div>
            </SignedOut>
        </HeaderLayout>
    )
}

export default Header;