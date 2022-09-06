import { NextPage } from "next"
import { ReactNode } from "react"
import { ChildrenProp } from "lib/types"
import Header from "components/Header/Header"

const PageLayout = ({ children }: ChildrenProp) => {
    return (
        <div>
            { children }
        </div>
    )
}

export default PageLayout;