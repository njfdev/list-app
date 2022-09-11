import { mdiPlusCircle, mdiCartOutline, mdiFormatListBulleted } from '@mdi/js';
import style from "./Dashboard.module.css";
import Icon from "@mdi/react";
import Link from "next/link";
import { ListsProp } from 'lib/types';
import { NextPage } from 'next';
import { UserButton, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Dashboard: NextPage<ListsProp> = ({ lists }) => {
    const { user } = useUser();
    const router = useRouter();

    return (
        <div className={style.container}>
            <div className={style.header}>
                <div>
                    <h2>
                        Welcome, {user?.firstName}
                    </h2>
                    <h3>
                        {(new Date()).toLocaleDateString()}
                    </h3>
                </div>
                <UserButton />
            </div>
            <div id={style.listTitleContainer}>
                <h2>Lists</h2>
                <button onClick={() => router.push("/create-list")}>+</button>
            </div>
            <div id={style.allLists}>
                {lists.map((list) => {
                    return <Link key={list.id} href={`/list?id=${list.id}`}>
                        <div className={style.list}>
                            <Icon path={mdiFormatListBulleted} className={style.listIcon} />
                            <div>
                                <h3 className={style.listTitle}>{list.title}</h3>
                                <p className={style.listDesc}>Ipsum dolore nisi officia mollit ea sint esse culpa reprehenderit deserunt quis irure cillum.</p>
                            </div>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    )
}

export default Dashboard;