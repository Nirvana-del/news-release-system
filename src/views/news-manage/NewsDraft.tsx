import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification, ConfigProvider } from 'antd'
import { reqGetDraftList, reqDeleteNews, reqSendNews } from '@/api/news';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import {User} from "@/views/user-manage/types";
import {Category, News} from "@/views/news-manage/types";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";
const { confirm } = Modal;

const NewsDraft: React.FC = () => {
    const navItems = ['新闻管理','草稿箱']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const userStr = localStorage.getItem('user')
    let _user: Partial<User> = {
        username: ''
    }
    if (userStr) _user = JSON.parse(userStr)
    const { username } = _user
    const [dataSource, setDataSource] = useState([])
    const navigate = useNavigate()
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 200,
            render(id:string) {
                return (
                    <b>{id}</b>
                )
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'label',
            width: 200,
            render:(label:string, item:News) => {
                return <NavLink to={`/news-manage/preview/${item.id}`}>{label}</NavLink>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            width: 200,
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            width: 200,
            render:(category:Category) => {
                console.log(category);
                return <span>{category.label}</span>
            }
        },
        {
            title: '操作',
            render(item:News) {
                return (
                    <div>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/news-manage/update/${item.id}`)}>修改</Button>&nbsp;
                        <Button type="primary" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)}>提交审核</Button>&nbsp;
                        <Button danger onClick={() => showConfirm(item)} icon={<DeleteOutlined />} >删除</Button>

                    </div>
                )
            },
        },
    ]
    // 将草稿箱内容上传至审核列表
    const handleCheck = (id:string) => {
        reqSendNews(id).then((res:any) => {
            if (res.code === 200){
                notification.info({
                    message: `通知`,
                    description:
                        `您可以到审核列表中查看您的新闻`,
                    placement:'bottomRight',
                });
                getDraftList()
            }

            // navigate('/audit-manage/list')
        })
    }

    // 获取草稿列表
    const getDraftList = () => {
        reqGetDraftList(username!).then(res => {
            console.log(res.data);
            setDataSource(res.data.draftList)
        })
    }
    const showConfirm = (item:News) => {
        confirm({
            title: '您确定要删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                reqDeleteNews(item.id).then((res:any) => {
                    if (res.code === 200){
                        getDraftList()
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        getDraftList()
    }, [])

    return (
        <div>
            <ConfigProvider renderEmpty={EmptyState}>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
            </ConfigProvider>
        </div>
    )
}
export default NewsDraft