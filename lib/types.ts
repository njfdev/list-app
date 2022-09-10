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

export enum AuthType {
    SignIn = "signin",
    SignUp = "signup",
};

export interface AuthProp {
    type: AuthType;
};