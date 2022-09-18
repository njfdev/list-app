import style from "./PageLayout.module.css";
import {NextPage} from 'next';
import {UserButton, useUser} from '@clerk/nextjs';
import {ReactNode} from "react";

const PageLayout: NextPage<{ children: ReactNode, header: ReactNode }> = ({ children, header }) => {
    return (
        <div className={style.container}>
            <div className={style.header}>
                <div>
                    {header}
                </div>
                <UserButton/>
            </div>
            {children}
        </div>
    )
}

export default PageLayout;