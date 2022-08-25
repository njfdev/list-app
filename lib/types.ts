import { ReactNode } from "react";

export interface ChildrenProp {
    children: ReactNode;
}

export interface ListsProp {
    lists: {
        id: string;
        title: string;
    }[]
}