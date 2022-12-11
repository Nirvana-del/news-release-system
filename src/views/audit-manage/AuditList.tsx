import React, { useEffect, useState } from 'react'
import { reqGetUserAuditList, reqUpdateNews } from '@/api/news'
import {Table, Tag, Button, notification, ConfigProvider} from 'antd'
import { NavLink, useNavigate } from 'react-router-dom';
import {User} from "@/views/user-manage/types";
import {ColumnsType} from "antd/es/table";
import {News} from "@/views/news-manage/types";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";

const AuditList: React.FC = () => {
    const navItems = ['审核管理','审核列表']
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
    const navigate = useNavigate()
    const getAuditList = () => {
        reqGetUserAuditList(username!).then(res => {
            console.log(res.data);
            setDataSource(res.data.auditList)
        })
    }
    const [dataSource, setDataSource] = useState([])
    const colorMap = {
        '1': 'orange',
        '2': 'green',
        '3': 'red'
    }
    const stateMap = {
        '1': '审核中',
        '2': '已通过',
        '3': '未通过'
    }
    const columns: ColumnsType<News> = [
        {
            title: '新闻标题',
            dataIndex: 'label',
            render: (label, item) => {
                return <NavLink to={`/news-manage/preview/${item.id}`}>{label}</NavLink>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render(category) {
                return (
                    <span>{category.label}</span>
                )
            },
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render(auditState) {
                return (
                    <Tag color={colorMap[auditState]}>{stateMap[auditState]}</Tag>
                )
            },
        },
        {
            title: '操作',
            render(item) {
                return (
                    <div>
                        {
                            item.auditState === 1 && <Button danger onClick={() => handleRevoke(item)}>撤销</Button>
                        }
                        {
                            item.auditState === 2 && <Button onClick={() => handlePublish(item)}>发布</Button>
                        }
                        {
                            item.auditState === 3 && <Button type='primary' onClick={() => navigate(`/news-manage/update/${item.id}`)}>更新</Button>
                        }
                    </div>
                )
            },
        }

    ]
    const handleRevoke = (item:News) => {
        console.log(item);
        reqUpdateNews(item.id, {
            auditState: 0
        }).then((res:any) => {
            if (res.code === 200){
                notification.info({
                    message: `通知`,
                    description:
                        `您可以到草稿箱中查看您的新闻`,
                    placement: 'bottomRight',
                });
                getAuditList()
            }

        })
    }

    const handlePublish = (item:News) => {
        reqUpdateNews(item.id, {
            publishState: 2,
            publishTime: Date.now()
        }).then((res:any) => {
            if (res.code === 200){
                notification.info({
                    message: `通知`,
                    description:
                        `您可以到【发布管理/已发布】中查看您的新闻`,
                    placement: 'bottomRight',
                });
                getAuditList()
            }

        })
    }
    useEffect(() => {
        getAuditList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <ConfigProvider renderEmpty={EmptyState}>
                <Table dataSource={dataSource} columns={columns}
                       pagination={{
                           pageSize: 5
                       }}
                       rowKey={(item) => item.id}
                />
            </ConfigProvider>

        </div>
    )
}
export default AuditList