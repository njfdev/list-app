import {ChildrenProp} from "lib/types"
import styles from "./HeaderLayout.module.css"

const HeaderLayout = ({children}: ChildrenProp) => {
    return (
        <div className={styles.layout}>
            {children}
        </div>
    )
}

export default HeaderLayout;