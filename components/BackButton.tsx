import { mdiChevronLeft } from "@mdi/js";
import Icon from "@mdi/react";
import style from "./BackButton.module.css"

interface BackButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const BackButton = ({ onClick }: BackButtonProps) => {
    return (
        <button className={style.button} onClick={onClick}>
            <Icon
                path={mdiChevronLeft}
                size={1.5}
                />
            <p>Back</p>
        </button>
    )
}

export default BackButton;