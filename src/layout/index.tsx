import React from 'react';
import {Breadcrumb, Layout} from 'antd';
import AppSideMenu from "@/layout/AppSideMenu";
import AppHeader from "@/layout/AppHeader";
import AppContent from "@/layout/AppContent";
import AppFooter from "@/layout/AppFooter";

const AppLayout: React.FC = () => (
        <Layout style={{ minHeight: '100vh' }}>
          <AppSideMenu />
            <Layout className="site-layout">
                <AppHeader ></AppHeader>
                <AppContent />
                <AppFooter />
            </Layout>
        </Layout>
    );
export default AppLayout;