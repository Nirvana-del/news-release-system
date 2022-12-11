import React, {useEffect, useMemo, useState} from 'react'
import {Form, Input, Modal, Select} from "antd";
import {reqAddUser, reqUpdateUser} from "@/api/user";
import {Region} from "@/views/region-manage/types";
import {Role, RoleMap} from "@/views/permission-manage/types/role";
import {User} from "@/views/user-manage/types";
import EmptyState from "@/components/antd/EmptyState";

interface Props {
    visible: boolean,
    userInfo?: User,
    regionList: Region[],
    roleList: Role[],
    initUserList: () => void,
    getRegionList: () => void,
    getRoleList: () => void,
    isEdit: boolean,
    regionLoading: boolean,
    roleLoading: boolean
    handleVisible: (open: boolean) => void
}

const UserForm: React.FC<Props> = (props) => {
    const {
        visible, userInfo, regionList, roleList, initUserList,
        getRegionList, getRoleList, isEdit, regionLoading, roleLoading, handleVisible
    } = props

    const [regionDisabled, setRegionDisabled] = useState<boolean>(false)

    const [form] = Form.useForm();

    // 点击Modal确定按钮
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
            if (isEdit) {
                const {id} = userInfo!
                await reqUpdateUser(id!, values)
            } else {
                await reqAddUser(values)
            }
            handleVisible(false)
            form.resetFields()
            initUserList()
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    // 模态框标题
    const title = useMemo(() => {
    if(isEdit) return '编辑用户'
        else return '添加用户'
    }, [isEdit]);

    useEffect(() => {
        if (!visible) {
            setRegionDisabled(false)
            form?.resetFields()
        } else {
            if (isEdit) {
                userInfo && form?.setFieldsValue(userInfo)
                setRegionDisabled(userInfo?.roleId === RoleMap.SUPER_ADMIN)
            }
        }
    }, [visible, form, userInfo])
    return (
        <Modal
            title={title}
            open={visible}
            // 预渲染 Modal 内元素
            forceRender={true}
            okText="确定"
            cancelText="取消"
            onCancel={() => handleVisible(false)}
            onOk={() => handleOk()}
        >
            <Form layout='vertical' form={form}>
                <Form.Item
                    name='username'
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: '用户名不能为空'
                        },
                    ]}
                >
                    <Input placeholder="用户名"/>
                </Form.Item>

                <Form.Item
                    name='password'
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '密码不能为空'
                        },
                    ]}
                >
                    <Input.Password placeholder="密码"/>
                </Form.Item>
                <Form.Item
                    name='roleId'
                    label="角色"
                    rules={[
                        {
                            required: true,
                            message: '请选择角色'
                        },
                    ]}
                >
                    <Select
                        placeholder="请为该用户分配角色"
                        allowClear
                        fieldNames={{label: 'roleName', value: 'id'}}
                        loading={roleLoading}
                        onDropdownVisibleChange={(open) => open && getRoleList()}
                        options={roleList}
                        notFoundContent={<EmptyState />}
                        onChange={(value) => {
                            if (value === RoleMap.SUPER_ADMIN) {
                                form.setFieldsValue({
                                    region: '全国'
                                })
                                setRegionDisabled(true)
                            } else {
                                form.setFieldsValue({
                                    region: null
                                })
                                setRegionDisabled(false)
                            }
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name='region'
                    label="区域"
                    rules={[
                        {
                            required: true,
                            message: '请选择区域'
                        },
                    ]}
                >
                    <Select
                        placeholder="选择区域"
                        allowClear
                        loading={regionLoading}
                        notFoundContent={<EmptyState />}
                        onDropdownVisibleChange={(open) => open && getRegionList()}
                        options={regionList}
                        disabled={regionDisabled}
                    />

                </Form.Item>

            </Form>
        </Modal>
    )
}
export default UserForm