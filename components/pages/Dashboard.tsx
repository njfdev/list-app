import {mdiFormatListBulleted} from '@mdi/js';
import style from "./Dashboard.module.css";
import Icon from "@mdi/react";
import Link from "next/link";
import {ListsProp} from 'lib/types';
import {NextPage} from 'next';
import {UserButton, useUser} from '@clerk/nextjs';
import {useRouter} from 'next/router';
import {trpc} from "../../lib/trpc";
import {useEffect, useState} from "react";
import {TodoList} from "@prisma/client";
import PageLayout from "../Layouts/PageLayout";

const Dashboard: NextPage<{ lists: TodoList[] }> = ({ lists }) => {
    const {user} = useUser();
    const router = useRouter();

    const listsQuery = trpc.useQuery([
        "get-all-lists"
    ]);

    return (
        <PageLayout header={
            <>
                <h2>
                    Welcome, {user?.firstName}
                </h2>
                <h3>
            {(new Date()).toLocaleDateString()}
                </h3>
            </>
        }>
            <div id={style.listTitleContainer}>
                <h2>Lists</h2>
                <button onClick={() => router.push("/create-list")}>+</button>
            </div>
            <div id={style.allLists}>
                {(listsQuery.data?.lists ?? lists ?? []).map((list) => {
                    return <Link key={list.id} href={`/list?id=${list.id}`}>
                        <div className={style.list}>
                            <Icon path={mdiFormatListBulleted} className={style.listIcon}/>
                            <div>
                                <h3 className={style.listTitle}>{list.title}</h3>
                                <p className={style.listDesc}>Ipsum dolore nisi officia mollit ea sint esse culpa
                                    reprehenderit deserunt quis irure cillum.</p>
                            </div>
                        </div>
                    </Link>
                })}
            </div>
        </PageLayout>
    )
}

export default Dashboard;