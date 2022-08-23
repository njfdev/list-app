import CreateListButton from "components/IconTextButton";
import { NextPage } from "next";
import { mdiCartOutline, mdiFormatListBulleted } from "@mdi/js";
import style from "./CreateList.module.css"

const Dashboard: NextPage = () => {
    return (
        <div className={style.grid}>
            <CreateListButton icon={mdiFormatListBulleted} iconSize="25%">Create a new todo list. A simple way to check off your tasks.</CreateListButton>
            <CreateListButton icon={mdiCartOutline} iconSize="25%">Create a new shopping list to use at the store.</CreateListButton>
        </div>
    )
};

export default Dashboard;