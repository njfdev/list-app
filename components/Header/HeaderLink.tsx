import Link from "next/link";
import { ChildrenProp } from "lib/types";
import style from "./HeaderLink.module.css"

interface LinkProps extends ChildrenProp {
    href: string;
}

const HeaderLink = ({ children, href }: LinkProps) => {
    return (
        <Link href={href}>
            <a className={style.link}>
                { children }
            </a>
        </Link>
    )
}

export default HeaderLink;