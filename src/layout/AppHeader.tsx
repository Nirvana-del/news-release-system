import React from 'react'
import {Header} from "antd/es/layout/layout";
import {Breadcrumb} from "antd";

export default function AppHeader() {
    return (
        <Header className="site-layout-background" style={{ paddingLeft: '16px' }} >
            <Breadcrumb style={{ lineHeight: '64px' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
        </Header>
    )
}
