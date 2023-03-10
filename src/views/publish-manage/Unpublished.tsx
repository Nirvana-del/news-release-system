import NewsPublish from '@/components/publish-manage/NewsPublish'
import usePublish from '@/components/publish-manage/hooks/usePublish'
import { Button } from 'antd'
import React, {useEffect} from "react";
import {store} from "@/redux";

const Unpublished: React.FC = () => {
    const navItems = ['发布管理','待发布']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const { dataSource, handlePublish } = usePublish(1)
    const publishButton = (id:string) => {
        return <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>
    }
    return (
        <div>
            <NewsPublish dataSource={dataSource}
                         customizeButton={(id) => publishButton(id)} />
        </div>
    )
}
export default Unpublished