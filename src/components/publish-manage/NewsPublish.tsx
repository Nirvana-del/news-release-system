import {ConfigProvider, Table} from 'antd'
import {NavLink} from 'react-router-dom';
import {ColumnsType} from "antd/es/table";
import {News} from "@/views/news-manage/types";
import React from "react";
import EmptyState from "@/components/antd/EmptyState";

interface PublishProps {
    customizeButton: (id: string) => React.ReactNode,
    dataSource: News[]
}

const NewsPublish: React.FC<PublishProps> = (props) => {
    const {customizeButton, dataSource} = props
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
                return (
                    <div>
                        {customizeButton(item.id)}
                    </div>
                )
            },
        }

    ]
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
export default NewsPublish