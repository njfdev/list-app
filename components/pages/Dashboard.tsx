import IconTextButton from "components/IconTextButton"
import { mdiPlusCircle, mdiCartOutline, mdiFormatListBulleted } from '@mdi/js';
import style from "./Dashboard.module.css";
import Icon from "@mdi/react";
import Link from "next/link";

const Dashboard = () => {
    return (
        <div className={style.container}>
            <div className={style.box}>
                <Link href="/create-list">
                    <div>
                        <Icon path={mdiPlusCircle} size={3} />
                        <h2>Create new list</h2>
                    </div>
                </Link>
                {/* Placeholder Lists */}
                <div>
                    <Icon path={mdiFormatListBulleted} size={3} />
                    <h2>My epic todo list</h2>
                </div>
                <div>
                    <Icon path={mdiCartOutline} size={3} />
                    <h2>The groceries!</h2>
                </div>
                <div>
                    <Icon path={mdiFormatListBulleted} size={3} />
                    <h2>My life goals</h2>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;