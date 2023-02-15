import {User} from "@/views/user-manage/types";
import {Permission} from "@/views/permission-manage/types/permission";
import React from "react";


export interface AuthProviderValue {
    handleLogin: (username: string, password: string) => void;
    handleLogout: () => void;
    user: Partial<User>;
    rightTree: Permission[];
    loading: boolean,
    routeList: routePath[]
}

export interface routePath {
    path: string,
    element: React.ReactNode,
    children?: Partial<routePath> [],
    pagePermission: number,
    routePermission: number
}