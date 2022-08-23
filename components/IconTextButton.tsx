import { ChildrenProp } from "lib/types";
import style from "./IconTextButton.module.css"
import Icon from "@mdi/react"

interface CreateListButtonProps extends ChildrenProp {
    icon: string;
    iconSize: string;
}

const CreateListButton = ({ children, icon, iconSize }: CreateListButtonProps) => {
    return (
        <div className={style.container}>
            <Icon path={icon}
                style={{ width: iconSize, minWidth: iconSize }}
                className={style.icon} />
            <p className={style.text}>
                { children }
            </p>
        </div>
    )
}

export default CreateListButton;