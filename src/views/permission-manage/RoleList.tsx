import React, {useState, useEffect} from 'react'
import {Table, Button, Modal, Tree, ConfigProvider} from 'antd'
import {reqGetRoleList, reqDeleteRole, reqUpdateRole} from '@/api/role';
import {reqGetPermissionTree} from '@/api/permission';
import {UnorderedListOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {Permission} from "@/views/permission-manage/types/permission";
import {Role} from "@/views/permission-manage/types/role";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";

const {confirm} = Modal;

const RoleList: React.FC = () => {
    const navItems = ['权限管理','角色列表']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const [dataSource, setDataSource] = useState<Role[]>([])
    const [rightList, setRightList] = useState<Permission[]>([])
    const [currentRights, setCurrentRights] = useState<string[]>([])
    const [parentRights, setParentRights] = useState<Permission[]>([])
    const [subRights, setSubRights] = useState<Permission[]>([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 300,
            render(id: number) {
                return (
                    <b>{id}</b>
                )
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            width: 500,
        },
        {
            title: '操作',
            render(item: Role) {
                return (
                    <div>
                        <Button danger onClick={() => deleteConfirm(item)} icon={<DeleteOutlined/>}>删除</Button>&nbsp;
                        <Button type="primary" onClick={() => showModal(item)}
                                icon={<UnorderedListOutlined/>}>编辑</Button>
                    </div>
                )
            },
        },
    ]
    // 删除角色确认
    const deleteConfirm = (item: Role) => {
        confirm({
            title: '您确定要删除吗?',
            icon: <ExclamationCircleOutlined/>,
            cancelText: "取消",
            okText: "确定",
            onOk() {
                deleteRole(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    // 获取角色列表
    const getRoleList = () => {
        reqGetRoleList().then(res => {
            console.log(res);
            setDataSource(res.data.roleList)
        })
    }
    // 删除角色
    const deleteRole = (item: Role) => {
        console.log(item);
        reqDeleteRole(item.id).then((res:any) => {
            if (res.code === 200){
                getRoleList()
            }

        })
    }
    // 获取权限列表
    const getRightsList = () => {
        reqGetPermissionTree().then(res => {
            console.log(res.data);
            setRightList(res.data.rightTree)
        })
    }

    useEffect(() => {
        getRoleList()
        getRightsList()
    }, [])

    // 设置模态框显示
    const showModal = (item: Role) => {
        console.log(item);
        setCurrentRights(item.pathList)
        setIsModalOpen(true);
        setCurrentId(item.id)
    }
    const handleOk = () => {
        console.log(currentRights);
        reqUpdateRole(currentId, {parentRights, subRights}).then((res:any) => {
            if (res.code === 200){
                getRoleList()
                setIsModalOpen(false);
            }

        })
    }
    const handleCancel = () => {
        console.log('cancel');
        setIsModalOpen(false);
    }

    /**勾选一级节点删除（添加）二级节点
     *
     * @param {*} checked
     * @param {*} childrenKeys 子路径列表
     * @param path
     */
    const handleChildren = (checked: boolean, childrenKeys: string[], path: string) => {
        let newCurrentRights = [] as string[]
        if (checked) {
            // 取消勾选
            // 先取消勾选父节点
            newCurrentRights = [...currentRights]
            const idx = newCurrentRights.indexOf(path)
            newCurrentRights.splice(idx, 1)

            childrenKeys.forEach(item => {
                const index = newCurrentRights.indexOf(item)
                if (index > -1)
                    newCurrentRights.splice(index, 1)
            });
            setCurrentRights(newCurrentRights)
        } else {
            newCurrentRights = [...currentRights, ...childrenKeys, path]
            setCurrentRights([...new Set(newCurrentRights)])
        }
    }

    const changeRights = (checkedKeys: any, e: any) => {
        const {node, checkedNodes} = e
        let parentArr = [] as Permission[]
        let subArr = [] as Permission[]
        checkedNodes.forEach((item: Permission) => {
            // 如果是一级路由
            if (item.rightId == null) {
                parentArr.push(item)
            } else {
                subArr.push(item)
            }
        })
        setParentRights(parentArr)
        setSubRights(subArr)
        let childrenNodes = node.children
        if (node.grade === 1 && childrenNodes.length !== 0) {
            // 对子节点进行全选和反选
            const childrenPathList = childrenNodes.map((item: Permission) => item.path)
            handleChildren(node.checked, childrenPathList, node.path)
        } else {
            setCurrentRights(checkedKeys.checked)
        }
    }

    return (
        <div>
            <ConfigProvider renderEmpty={EmptyState}>
                <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/>
            </ConfigProvider>
            <Modal title="权限分配"
                   cancelText="取消"
                   okText="确定"
                   open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    treeData={rightList}
                    fieldNames={{title: 'label', key: 'path'}}
                    checkStrictly
                    onCheck={(checkedKeys, e) => changeRights(checkedKeys, e)}
                />
            </Modal>
        </div>
    )
}
export default RoleList