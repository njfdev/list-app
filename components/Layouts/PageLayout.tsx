import { NextPage } from "next"
import { ReactNode } from "react"
import { ChildrenProp } from "../../lib/Types"
import Header from "../Header"

const PageLayout: NextPage<ChildrenProp> = ({ children }) => {
    return (
        <div>
            <Header />
            { children }
        </div>
    )
}

export default PageLayout;