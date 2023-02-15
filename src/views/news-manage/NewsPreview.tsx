import React, {useEffect, useState} from 'react'
import {Descriptions} from 'antd';
import {reqGetNewsDetail} from '@/api/news'
import {useParams} from 'react-router-dom';
import moment from 'moment'
import {News} from "@/views/news-manage/types";

const NewsPreview: React.FC = () => {
    const params = useParams()
    const [newsInfo, setNewsInfo] = useState<News>()
    const colorMap = {
        '0': '#909399',
        '1': '#E6A23C',
        '2': '#67C23A',
        '3': '#F56C6C'
    }
    useEffect(() => {
        reqGetNewsDetail(params.id!).then(res => {
            console.log(res.data);
            setNewsInfo(res.data.newsDetail)
        })
    }, [params])
    const auditMap = ['未审核', '审核中', '已通过', '未通过']
    const publishMap = ['未发布', '待发布', '已上线', '已下线']

    return (
        <div>
            {
                newsInfo && <div>
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item
                            label="创建时间">{moment(Number(newsInfo.createTime)).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                        <Descriptions.Item
                            label="发布时间">{newsInfo.publishTime ? moment(Number(newsInfo.publishTime)).format("YYYY/MM/DD HH:mm:ss") : '-'}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态"><span
                            style={{color: colorMap[newsInfo.auditState]}}>{auditMap[newsInfo.auditState]}</span></Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span
                            style={{color: colorMap[newsInfo.publishState]}}>{publishMap[newsInfo.publishState]}</span></Descriptions.Item>
                        <Descriptions.Item label="访问数量"><span
                            style={{color: '#409EFF'}}>{newsInfo.view}</span></Descriptions.Item>
                        <Descriptions.Item label="点赞数量"><span
                            style={{color: '#409EFF'}}>{newsInfo.star}</span></Descriptions.Item>
                        <Descriptions.Item label="评论数量">0</Descriptions.Item>
                    </Descriptions>

                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{
                        margin: '30px 20px',
                        padding: '15px',
                        border: '1px solid #E6E8EB'
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}
export default NewsPreview