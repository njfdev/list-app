import IconTextButton from "components/IconTextButton";
import {NextPage} from "next";
import {mdiCartOutline, mdiFormatListBulleted} from "@mdi/js";
import style from "./CreateList.module.css"
import {useState} from "react";
import BackButton from "components/BackButton";

enum Page {
    ChooseList,
    CreateTodoList,
    CreateShoppingList,
}

const Dashboard: NextPage = () => {
    const [page, setPage] = useState<Page>(Page.ChooseList);

    const ChooseList = () => {
        return (
            <div className={style.grid}>
                <IconTextButton
                    icon={mdiFormatListBulleted}
                    iconSize="25%"
                    onClick={() => {
                        setPage(Page.CreateTodoList)
                    }}
                >
                    Create a new todo list. A simple way to check off your tasks.
                </IconTextButton>
                <IconTextButton
                    icon={mdiCartOutline}
                    iconSize="25%"
                    onClick={() => {
                        setPage(Page.CreateShoppingList)
                    }}
                >
                    Create a new shopping list to use at the store.
                </IconTextButton>
            </div>
        );
    }

    const CreateTodoList = () => {
        return (
            <div className={style.createTodoListContainer}>
                <h1>Create a New Todo List</h1>
                <form action="/api/db/todo-lists" method="POST">
                    <label htmlFor="title">Todo List Title</label>
                    <input id="title" name="title" type='text'/>
                    <label htmlFor="description">Description</label>
                    <input id="description" name="description" type='text'/>
                    <br/>
                    <input className={style.createTodoListButton} type="submit" value="Create Todo List"/>
                </form>
            </div>
        )
    }

    return (
        <div className={style.container}>
            {
                page !== Page.ChooseList &&
                <BackButton onClick={() => {
                    setPage(Page.ChooseList)
                }}/>
            }
            {
                page === Page.ChooseList &&
                <ChooseList/>
                ||
                page === Page.CreateTodoList &&
                <CreateTodoList/>
                ||
                page === Page.CreateShoppingList &&
                <h1>Not Yet Implemented</h1>
            }
        </div>
    )
};

export default Dashboard;