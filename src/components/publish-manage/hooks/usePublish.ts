import { useEffect, useState } from 'react'
import { reqGetNewsListByPublishState, reqUpdateNews, reqDeleteNews, reqGetOfflineNewsList } from '@/api/news';
import { notification } from 'antd'
import {User} from "@/views/user-manage/types";
import {News} from "@/views/news-manage/types";

const usePublish = (publishState:number) => {
    const userStr = localStorage.getItem('user')
    let _user: Partial<User> = {
        username: ''
    }
    if (userStr) _user = JSON.parse(userStr)
    const { username, roleId, region } = _user
    const [dataSource, setDataSource] = useState<News[]>([])
    const getNewsListByPublishState = () => {
        // 获取已下线的新闻
        if (publishState === 3) {
            console.log(roleId, region);
            reqGetOfflineNewsList().then(res => {
                // console.log('已下线',res.data);
                let list = res.data.sunsetList as News[]
                console.log(list);
                switch (roleId) {
                    case 1:
                        setDataSource(list)
                        break;
                    case 2:
                        list = [...list.filter(item => item.author === username ||
                            (item.roleId === 3 && item.region === region))]
                        setDataSource(list)
                        break;
                    case 3:
                        list = list.filter(item => {
                            return item.author === username
                        })
                        setDataSource(list)
                        break;
                    default:
                        setDataSource(list)
                        break;

                }

            })
        }
        else reqGetNewsListByPublishState(publishState, username!).then(res => {
            // console.log('根据状态获取新闻列表',res.data);
            setDataSource(res.data.newsList)
        })

    }
    useEffect(() => {
        getNewsListByPublishState()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePublish = (id:string) => {
        console.log(id);
        reqUpdateNews(id, {
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
                getNewsListByPublishState()
            }

        })

    }
    const handleSunset = (id:string) => {
        console.log(id);
        reqUpdateNews(id, {
            publishState: 3
        }).then((res:any) => {
            if (res.code === 200){
                notification.info({
                    message: `通知`,
                    description:
                        `您可以到【发布管理/已下线】中查看您的新闻`,
                    placement: 'bottomRight',
                });
                getNewsListByPublishState()
            }

        })
    }
    const handleDelete = (id:string) => {
        console.log(id);
        reqDeleteNews(id).then((res:any) => {
            if (res.code === 200){
                notification.info({
                    message: `通知`,
                    description:
                        `您已经删除该新闻`,
                    placement: 'bottomRight',
                });
                getNewsListByPublishState()
            }

        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}
export default usePublish