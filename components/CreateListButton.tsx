import { ChildrenProp } from "lib/types";
import style from "./CreateListButton.module.css"
import Icon from "@mdi/react"

interface CreateListButtonProps extends ChildrenProp {
    icon: string;
}

const CreateListButton = ({ children, icon }: CreateListButtonProps) => {
    return (
        <div className={style.container}>
            <Icon path={icon}
                className={style.icon} />
            <p className={style.text}>
                { children }
            </p>
        </div>
    )
}

export default CreateListButton;