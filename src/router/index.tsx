import React, {lazy, Suspense} from 'react'
import Home from "@/views/Home";
import {Navigate, useRoutes} from "react-router-dom";
import Layout from "@/layout";

const About = lazy(() => import('@/views/About'))
const User = lazy(() => import('@/views/User'))

const withLoadingComponent = (comp:JSX.Element) => (
    <Suspense fallback={<div>Loading...</div>}>
        {comp}
    </Suspense>
)

export default function AppRouter() {
    return useRoutes([
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    path: '',
                    element:<Navigate to="/home" /> ,
                },
                {
                    path: 'home',
                    element: <Home></Home>,
                },
                {
                    path: 'about',
                    element: withLoadingComponent(<About />),
                },
                {
                    path: 'user',
                    element:withLoadingComponent(<User />),
                }
            ]
        }
    ])
}

