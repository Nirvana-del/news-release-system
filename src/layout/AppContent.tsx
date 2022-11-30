import React from 'react'
import {Content} from "antd/es/layout/layout";
import {Outlet} from "react-router-dom";

export default function AppContent() {
    return (
        <Content style={{ margin: '16px 16px 0' }} className="site-layout-background">
            <div style={{ padding: 24, minHeight: 360 }}>
                <Outlet />
            </div>
        </Content>
    )
}
