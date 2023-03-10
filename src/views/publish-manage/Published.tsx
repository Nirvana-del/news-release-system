import React, {useEffect} from 'react'
import NewsPublish from "@/components/publish-manage/NewsPublish";
import usePublish from "@/components/publish-manage/hooks/usePublish";
import {Button} from "antd";
import {store} from "@/redux";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";

const Published: React.FC = () => {
    const navItems = ['发布管理','已发布']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const { dataSource, handleSunset } = usePublish(2)
    const sunsetButton = (id:string) => {
        return <Button danger type='primary' onClick={() => handleSunset(id)}>下线</Button>
    }
    return (
        <div>
            <NewsPublish dataSource={dataSource} customizeButton={(id) => sunsetButton(id)} />
        </div>
    )
}
export default Published