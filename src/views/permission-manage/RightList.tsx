import React, {useState, useEffect} from 'react'
import {Table, Tag, Button, Modal, Popover, Switch, ConfigProvider} from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import {
    deletePermission,
    reqGetPermissionTree,
    deleteChildPermission,
    updatePermission,
    updateChildPermission
} from '@/api/permission';
import {Permission} from "@/views/permission-manage/types/permission";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";

const {confirm} = Modal;
const permissionMap = {
    1: true,
    0: false
}

const RightList: React.FC = () => {
    const navItems = ['权限管理','权限列表']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 200,
            render(id: number) {
                return (
                    <b>{id}</b>
                )
            }
        },
        {
            title: '权限名称',
            dataIndex: 'label',
            width: 300,
        },
        {
            title: '权限路径',
            dataIndex: 'path',
            width: 400,
            render(path: string) {
                return (
                    <Tag color="orange">{path}</Tag>
                )
            },
        },
        {
            title: '操作',
            render(item: Permission) {
                return (
                    <div>
                        <Button danger onClick={() => showConfirm(item)} icon={<DeleteOutlined/>}>删除</Button>&nbsp;
                        <Popover content={<div style={{textAlign: 'center'}}>
                            <Switch checked={permissionMap[item.pagePermission]}
                                    onChange={() => switchRights(item)}></Switch>
                        </div>} title="页面配置项" trigger={item.pagePermission === undefined ? '' : 'click'}>
                            <Button type="primary" icon={<EditOutlined/>}
                                    disabled={item.grade === 2}
                            >修改</Button>
                        </Popover>
                    </div>
                )
            },
        }

    ]
    const [dataSource, setDataSource] = useState([])
    const showConfirm = (item: Permission) => {
        confirm({
            title: '您确定要删除吗?',
            okText: '确定',
            cancelText: '取消',
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                deleteRight(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    const getRightList = () => {
        reqGetPermissionTree().then(res => {
            console.log('权限列表', res.data);
            const list = res.data.rightTree
            list.forEach((item: Permission) => {
                if (item.children!.length === 0)
                    item.children = undefined
            });
            setDataSource(list)
        })
    }
    const deleteRight = (item: Permission) => {
        console.log(item);
        if (item.grade === 1) {
            deletePermission(item.id).then((res:any) => {
                 if (res.code === 200){
                     getRightList()
                 }
            })
        } else {
            deleteChildPermission(item.id).then((res:any) => {
                 if (res.code === 200){
                     getRightList()
                 }
            })
        }

    }
    const switchRights = (item: Permission) => {
        item.pagePermission = item.pagePermission === 1 ? 0 : 1
        if (item.grade === 1) {
            updatePermission(item).then((res:any) => {
                 if (res.code === 200){
                     getRightList()
                 }
            })
        } else {
            updateChildPermission(item).then((res:any) => {
                 if (res.code === 200){
                     getRightList()

                 }
            })
        }
    }
    useEffect(() => {
        getRightList()
    }, [])
    return (
        <div style={{height:'530px'}}>
            <ConfigProvider renderEmpty={EmptyState}>
                <Table dataSource={dataSource} columns={columns}
                       pagination={{
                           pageSize: 5
                       }}
                       rowKey="path"
                />
            </ConfigProvider>
        </div>
    )
}
export default RightList