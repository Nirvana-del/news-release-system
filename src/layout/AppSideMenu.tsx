import React, {useEffect, useState} from 'react'
import {Menu, MenuProps} from "antd";
import Sider from "antd/es/layout/Sider";
import {
    DatabaseOutlined,
    GlobalOutlined,
    HomeOutlined,
    LockOutlined,
    SendOutlined,
    UnlockOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";
import {Permission} from "@/views/permission-manage/types/permission";
import {connect} from 'react-redux'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
        label,
        key,
        icon,
        children,
    } as MenuItem;
}

const iconMap = {
    "/home": <HomeOutlined/>,
    "/user-manage": <UserOutlined/>,
    "/right-manage": <LockOutlined/>,
    "/news-manage": <DatabaseOutlined/>,
    "/audit-manage": <UnlockOutlined/>,
    "/publish-manage": <SendOutlined/>
}

interface SideMenuProps {
    collapsed: boolean,
    changeCollapsed: (collapsed: boolean) => void
}

const AppSideMenu: React.FC<SideMenuProps> = (props) => {
    const {collapsed, changeCollapsed} = props
    const {rightTree} = useAuthContext()
    // const [openKeys, setOpenKeys] = useState([] as string[]);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const navigate = useNavigate()
    const location = useLocation()
    const defaultOpenKeys = ['/' + location.pathname.split('/')[1]]
    const handleClick: MenuProps['onClick'] = ({key}) => {
        navigate(key)
    };
    // 控制展开项只能有一个
    // const handleOpenChange = (keys: string[]) => {
    //     setOpenKeys([keys.at(-1)!])
    // };
    //将权限树处理成侧边栏菜单格式的数据
    const generateMenu = (menuList: Permission[]): MenuItem[] => {
        return menuList.map((item) => {
            const {label, path, children, pagePermission} = item
            if (pagePermission !== 1) {
                return null
            }
            if (children && children.length) {
                return getItem(label, path, iconMap[path], generateMenu(children))
            } else {
                return getItem(label, path, iconMap[path])
            }
        })
    }

    useEffect(() => {
        setMenu(generateMenu(rightTree))
    }, [rightTree])
    return (
        <Sider id="side-menu" collapsible collapsed={collapsed} onCollapse={(value) => changeCollapsed(value)}>
            <div className="app-title">
                {
                    !collapsed ? <span><div>新闻发布管理系统</div></span> :
                        <span className="app-icon"><GlobalOutlined spin/></span>
                }
            </div>
            <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={defaultOpenKeys}
                selectedKeys={[location.pathname]}
                mode="inline"
                items={menu}
                onClick={handleClick}
            />
        </Sider>
    )
}
const mapStateToProps = (state: any) => {
    const {CollapsedReducer: {collapsed}} = state
    return {
        collapsed
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        changeCollapsed: (collapsed: boolean) => {
            dispatch({type: 'CHANGE_COLLAPSED', payload: collapsed})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSideMenu)
