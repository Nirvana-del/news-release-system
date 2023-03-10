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
import {routePath} from "@/components/Auth/types/auth-provider";
import Cookie from "js-cookie";

const whiteList = ['/login', '/news-list', '/news-detail']
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
        element: <Navigate to='/'></Navigate>
    }
]

export default function AppRouter() {
    const token = Cookie.get("token")
    const {routeList} = useAuthContext()
    console.log(routeList)
    NProgress.start()
    useEffect(() => {
        NProgress.done()
    })
    let asyncRoutes = [
        {
            path: '/',
            element: <Layout/>,
            children: [] as Partial<routePath>[]
        }
    ] as routePath[]
    // let routeObj = {
    //     path: '/',
    //     element: <Layout/>,
    //     // element: <Layout/>,
    //     children: [] as Partial<routePath>[]
    // }
    asyncRoutes[0].children = [...routeList]
    const staticRouter = useRoutes(staticRoutes)
    const dynamicRouter = useRoutes([...staticRoutes, ...asyncRoutes])
    if (!token || whiteList.includes(location.pathname)) {
        console.log('无token')
        return staticRouter
    } else {
        console.log('有token')
        return routeList.length > 0 ? dynamicRouter : null
    }
}

