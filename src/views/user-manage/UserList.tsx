import React, {useEffect, useState} from 'react'
import {reqDeleteUser, reqGetUserList, reqUpdateUser} from "@/api/user";
import {User} from "@/views/user-manage/types";
import {Role, RoleMap} from "@/views/permission-manage/types/role";
import {reqGetRegionList} from "@/api/region";
import {Region} from "@/views/region-manage/types";
import {reqGetRoleList} from "@/api/role";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {Button, ConfigProvider, Modal, Switch, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import UserForm from "@/views/user-manage/UserForm";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";

const {confirm} = Modal;

const UserList: React.FC = () => {
    const { user } = useAuthContext()
    const navItems = ['用户管理','用户列表']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const {region, role} = user
    // state
    const [dataSource, setDataSource] = useState([])
    const [regionList, setRegionList] = useState<Region[]>([])
    const [roleList, setRoleList] = useState<Role[]>([])
    const [regionLoading, setRegionLoading] = useState<boolean>(false);
    const [roleLoading, setRoleLoading] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<User>()
    const [visible, setVisible] = useState(false)

    // table字段
    const columns: ColumnsType<User> = [
        {
            title: '区域',
            dataIndex: 'region',
            width: 200,
            filters: [
                ...regionList.map((item) => ({
                    text: item.label,
                    value: item.value
                })),
                {
                    text: '全国',
                    value: ''
                }
            ],
            onFilter: (value, record) => {
                return record.region === value
            },
            render(region: string) {
                return (
                    <b>{region}</b>
                )
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            width: 200,
            filters: [
                ...roleList.map((item) => ({
                    text: item.roleName,
                    value: item.id
                }))
            ],
            onFilter: (value, record) => {
                console.log(value)
                return record.roleId === value
            },
            render(role: Role) {
                return (
                    <div>
                        {role.roleName}
                    </div>
                )
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            width: 250
        },
        {
            title: '用户状态',
            width: 250,
            render(item: User) {
                const {roleState, userDefault} = item
                return (
                    <Switch checked={roleState} disabled={userDefault || item.id === user.id}
                            onChange={() => changeUserState(item)}></Switch>
                )
            }
        },
        {
            title: '操作',
            render(item: User) {
                return (
                    <div>
                        <Button
                            danger
                            disabled={item.userDefault || item.id === user.id}
                            onClick={() => handleDelete(item)}
                            icon={<DeleteOutlined/>}>删除</Button>&nbsp;
                        <Button
                            type="primary" icon={<EditOutlined/>}
                            disabled={item.userDefault || item.id === user.id}
                            onClick={() => handleEdit(item)}>编辑</Button>
                    </div>
                )
            },
        }

    ]
    // 初始化用户列表
    const initUserList = () => {
        reqGetUserList().then(res => {
            // console.log('用户列表',res);
            const list = res.data.userList
            // 超级管理员展示全部
            if (user.roleId === RoleMap.SUPER_ADMIN) {
                setDataSource(list)
                // 展示自己和自己管理区域下的编辑（ps:区域编辑没有用户管理权限）
            } else {
                let sublist = list.filter((item: User) => {
                    return item.id === user.id || (item.region === region && item.roleId === RoleMap.EDITOR)
                })
                setDataSource(sublist)
            }
        })
    }
    // 获取区域列表
    const getRegionList = () => {
        setRegionList([])
        setRegionLoading(true)
        reqGetRegionList().then(res => {
            // console.log('区域列表',res);
            const list = res.data.regionList
            const subList = list.map((item: Region) => {
                if (item.value !== region) {
                    return {
                        ...item,
                        disabled: true
                    }
                } else {
                    return item
                }
            })
            setRegionList(role?.id === RoleMap.SUPER_ADMIN ? list : subList)
            setRegionLoading(false)
        })
    }
    // 获取角色列表
    const getRoleList = () => {
        setRoleList([])
        setRoleLoading(true)
        reqGetRoleList().then(res => {
            // console.log('角色列表',res);
            const list = res.data.roleList
            // 筛选区域管理员的角色分配权限
            const subList = list.map((item: Role) => {
                if (item.roleType !== RoleMap.EDITOR) {
                    return {
                        ...item,
                        disabled: true
                    }
                } else {
                    return item
                }
            })
            setRoleList(role?.id === RoleMap.SUPER_ADMIN ? list : subList)
            setRoleLoading(false)
        })
    }
    // 点击删除用户按钮
    const handleDelete = (userMessage: User) => {
        confirm({
            title: '您确定要删除吗?',
            icon: <ExclamationCircleOutlined/>,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                await reqDeleteUser(userMessage.id)
                initUserList()
            }
        });
    };
    // 点击添加用户按钮
    const handleAdd = () => {
        setVisible(true);
        setIsEdit(false)
    }
    // 点击更新用户按钮
    const handleEdit = (userMessage: User) => {
        setVisible(true)
        setIsEdit(true)
        setUserInfo(userMessage)
    };
    // 改变用户状态
    const changeUserState = async (item: User) => {
        const {id, roleState} = item
        await reqUpdateUser(id, {roleState: !roleState})
        initUserList()
    }

    useEffect(() => {
        initUserList()
        getRegionList()
        getRoleList()
    }, [])
    return (
        <div>
            <Button type='primary' onClick={() => handleAdd()}>新增用户</Button>
            <ConfigProvider renderEmpty={EmptyState}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                        pageSize: 5
                    }}
                    rowKey={item => item.id}
                />
            </ConfigProvider>
            <UserForm
                visible={visible}
                userInfo={userInfo}
                regionList={regionList}
                roleList={roleList}
                initUserList={initUserList}
                getRegionList={getRegionList}
                getRoleList={getRoleList}
                isEdit={isEdit}
                regionLoading={regionLoading}
                roleLoading={roleLoading}
                handleVisible={setVisible}
            ></UserForm>
        </div>
    )
}
export default UserList