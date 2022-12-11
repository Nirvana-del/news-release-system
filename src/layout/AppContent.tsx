import React from 'react'
import {Content} from "antd/es/layout/layout";
import LoadingOutlet from "@/components/antd/LoadingOutlet";

export default function AppContent() {
    return (
        <Content className="content-layout">
            <LoadingOutlet />
        </Content>
    )
}
