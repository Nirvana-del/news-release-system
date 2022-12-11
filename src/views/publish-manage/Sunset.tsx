import React, {useEffect} from 'react'
import usePublish from "@/components/publish-manage/hooks/usePublish";
import {Button, Popconfirm} from "antd";
import NewsPublish from "@/components/publish-manage/NewsPublish";
import {store} from "@/redux";

const Sunset: React.FC = () => {
    const navItems = ['发布管理','已下线']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const { dataSource, handleDelete } = usePublish(3)
    const deleteButton = (id:string) => {
        return <Popconfirm placement="topLeft" title='您确定要删除该新闻吗？'
                           onConfirm={() =>  handleDelete(id)} okText="确定" cancelText="取消">
            <Button danger>删除</Button>
        </Popconfirm>
    }
    return (
        <div>
            <NewsPublish dataSource={dataSource} customizeButton={(id) => deleteButton(id)} />

        </div>
    )
}
export default Sunset