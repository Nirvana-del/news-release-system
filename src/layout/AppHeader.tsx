import React from 'react'
import {Header} from "antd/es/layout/layout";
import {Avatar, Breadcrumb, Dropdown, Modal, MenuProps} from "antd";
import {User} from "@/views/user-manage/types";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";
import {connect} from 'react-redux'
import {UserOutlined} from "@ant-design/icons";

interface HeaderProps {
    navItems: string[]
}

const AppHeader: React.FC<HeaderProps> = (props) => {
    const { navItems } = props
    const jsonStr = localStorage.getItem('user')
    const {handleLogout} = useAuthContext()
    const [modal, contextHolder] = Modal.useModal();
    let user: Partial<User> = {
        username: '',
    }
    if (jsonStr) user = JSON.parse(jsonStr)
    const config = {
        title: '您确定要退出吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => handleLogout()

    };
    const handleClick = () => {
        console.log('退出')
        modal.confirm(config)
    }
    const menu: MenuProps['items'] = [
        {
            key: '1',
            label: user.username || '未登录',
            disabled: !user.id
        },
        {
            key: '2',
            label: (
                <span onClick={() => handleClick()}>退出</span>
            ),
            danger: true
        },
    ]
    return (
        <Header className="header-layout">
            <div className="breadcrumb">
                <Breadcrumb style={{lineHeight: '64px'}}>
                    {/*<Breadcrumb.Item>User</Breadcrumb.Item>*/}
                    {/*<Breadcrumb.Item>Bill</Breadcrumb.Item>*/}
                    {
                        navItems.map((item,index) =>  <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>)
                    }
                </Breadcrumb>
            </div>

            <div className="profile">
                {
                    user.username ?
                        <span> 欢迎<span className="title"> {user.username}</span></span> :
                        <span className="title">请登录</span>
                }

                <Dropdown menu={{items: menu}} className="avatar">
                    <Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                </Dropdown>
                {contextHolder}
            </div>
        </Header>
    )
}

const mapStateToProps = (state: any) => {
    const {BreadCrumbReducer: {navItems}} = state
    return {
        navItems
    }
}
export default connect(mapStateToProps)(AppHeader)
