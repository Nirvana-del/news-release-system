import React, {useEffect, useState} from 'react'
import {reqGetAuditList, reqUpdateNews} from '@/api/news'
import {Table, Button, ConfigProvider} from 'antd'
import {NavLink} from 'react-router-dom';
import {User} from "@/views/user-manage/types";
import {RoleMap} from "@/views/permission-manage/types/role";
import {News} from "@/views/news-manage/types";
import {ColumnsType} from "antd/es/table";
import EmptyState from "@/components/antd/EmptyState";
import {store} from "@/redux";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";

const AuditNews: React.FC = () => {
    const navItems = ['审核管理','审核新闻']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const { user } = useAuthContext()
    const [dataSource, setDataSource] = useState<News[]>([])
    const {roleId, region} = user

    const getAuditList = () => {
        reqGetAuditList().then(res => {
            console.log(res.data);
            const list = res.data.audits
            const subList = [...list.filter((item: News) => item.region === region && roleId === RoleMap.EDITOR)]
            setDataSource(roleId === RoleMap.SUPER_ADMIN ? list : subList)
        })
    }
    useEffect(() => {
        getAuditList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
            title: '操作',
            render(item) {
                console.log(item);
                return (
                    <div>
                        <Button type='primary' onClick={() => handleAdopt(item)}
                                style={{marginRight: '20px'}}>通过</Button>
                        <Button danger onClick={() => handleReject(item)}>驳回</Button>
                    </div>
                )
            },
        }

    ]
    // 通过审核
    const handleAdopt = (item: News) => {
        console.log(item);
        reqUpdateNews(item.id, {
            auditState: 2,
            publishState: 1
        }).then((res:any) => {
            if (res.code === 200){
                getAuditList()
            }
        })
    }
    // 驳回审核请求
    const handleReject = (item: News) => {
        console.log(item);
        reqUpdateNews(item.id, {
            auditState: 3,
            publishState: 0
        }).then((res:any) => {
            if (res.code === 200){
                getAuditList()
            }

        })
    }
    return (
        <div>
            <ConfigProvider renderEmpty={EmptyState}>
                <Table dataSource={dataSource} columns={columns}
                       pagination={{
                           pageSize: 5
                       }}
                       rowKey={item => item.id}
                />
            </ConfigProvider>
        </div>
    )
}
export default AuditNews