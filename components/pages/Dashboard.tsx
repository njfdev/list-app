import { mdiPlusCircle, mdiCartOutline, mdiFormatListBulleted } from '@mdi/js';
import style from "./Dashboard.module.css";
import Icon from "@mdi/react";
import Link from "next/link";
import { ListsProp } from 'lib/types';
import { NextPage } from 'next';

const Dashboard: NextPage<ListsProp> = ({ lists }) => {
    return (
        <div className={style.container}>
            <div className={style.box}>
                <Link href="/create-list">
                    <div>
                        <Icon path={mdiPlusCircle} size={3} />
                        <h2>Create new list</h2>
                    </div>
                </Link>
                {lists.map((list) => {
                    return <Link key={list.id} href={`/list?id=${list.id}`}>
                        <div>
                            <Icon path={mdiFormatListBulleted} size={3} />
                            <h2>{list.title}</h2>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    )
}

export default Dashboard;