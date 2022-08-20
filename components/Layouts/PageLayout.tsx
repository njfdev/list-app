import { NextPage } from "next"
import { ReactNode } from "react"
import { ChildrenProp } from "lib/types"
import Header from "components/Header"

const PageLayout: NextPage<ChildrenProp> = ({ children }) => {
    return (
        <div>
            <Header />
            { children }
        </div>
    )
}

export default PageLayout;