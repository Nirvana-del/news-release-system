import React, {useEffect, useState} from 'react'
import {Navigate, useRoutes} from "react-router-dom";
import Layout from "@/layout";
import NProgress from "nprogress"
import 'nprogress/nprogress.css'

import NewsDetail from "@/views/Tourist/newsDetail";
import NewsList from "@/views/Tourist/newsList";
import Login from "@/views/Login";
import NotFound from "@/views/404/NotFound";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";
import {getToken} from "@/utils/handleToken";
import {routePath} from "@/components/Auth/types/auth-provider";

const whiteList = ['/login', '/news-list', '/news-detail']
export default function AppRouter() {
    const token = getToken()
    const {routeList} = useAuthContext()

    NProgress.start()
    useEffect(() => {
        NProgress.done()
    })

    let routeObj = {
        path: '/',
        element: <Layout/>,
        children: [] as Partial<routePath>[]
    }
    const [dynamicRoute, setDynamicRoute] = useState<Partial<routePath>>(routeObj);
    useEffect(() => {
        routeObj.children = [...routeList]
        setDynamicRoute(routeObj)
    }, [routeList])
    let staticRoutes = [
        {
            path: '/login',
            element: <Login/>
        },
        {
            path: '/news-list',
            element: <NewsList/>
        },
        {
            path: '/news-detail/:id',
            element: <NewsDetail/>
        },
        {
            path: '/',
            element: <Navigate to="/home"></Navigate>
        },
        {
            path: '/404',
            element: <NotFound/>
        },
        {
            path: '*',
            element: <Navigate to='/404'></Navigate>
        }
    ]
    const staticRouter = useRoutes(staticRoutes)
    const dynamicRouter = useRoutes([...staticRoutes, dynamicRoute])
    if (!token) {
        return staticRouter
    } else {
        // 访问没有权限的路由，则不需要生成动态路由列表
        if (whiteList.includes(location.pathname)) {
            return staticRouter
        } else {
            return dynamicRoute.children!.length > 0 ? dynamicRouter : null
        }
    }
}

