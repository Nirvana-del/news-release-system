import React, { useEffect, useState } from 'react'
import { Button, Steps, Form, Input, Select, message, notification } from 'antd';
import NewsEdit from '@/components/news-manage/NewsEdit'
import style from './NewsAdd.module.css'
import { reqGetNewsCategories, reqAddNews } from '@/api/news'
import { useNavigate } from 'react-router-dom';
import {News} from "@/views/news-manage/types";
import {store} from "@/redux";
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";

const NewsAdd: React.FC = () => {
    const { user } = useAuthContext()
    const navItems = ['新闻管理','撰写新闻']
    useEffect(() => {
        store.dispatch({
            type: 'CHANGE_PAGE',
            payload: navItems
        })
    }, []);
    const { region, username, roleId } = user
    const openNotification = (auditState:number) => {
        notification.info({
            message: `通知`,
            description:
                `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
            placement:'bottomRight',
        });
    };
    // const NewsForm = useRef(null)
    const [NewsForm] = Form.useForm();
    const [current, setCurrent] = useState(0)
    const [newsCategories, setNewsCategories] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState('')
    const navigate = useNavigate()
    const handleSaveOrExamine = (auditState:number) => {
        const newsObj = {
            ...formInfo,
            content,
            region: region,
            author: username,
            roleId,
            auditState,
            publishState: 0,
            createTime: Date.now(),
            star: 0,
            view: 0,
            // publishTime: 0
        } as News
        reqAddNews(newsObj).then((res:any) => {
            console.log(res)
            if (res.code === 200){
                if(auditState === 0) {
                    openNotification(0)
                    navigate('/news-manage/draft')
                }
                else {
                    openNotification(1)
                    navigate('/audit-manage/list')
                }
            }

        })
    }

    const handleNext = () => {
        if (current === 0) {
            NewsForm.validateFields().then(res => {
                console.log(res);
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error);
            })
        } else {
            console.log(content);
            if(content === '' || content.trim()==='<p></p>'){
                message.error('新闻内容不能为空')
            }else{
                setCurrent(current + 1)
            }
        }
    }
    const getNewsCategories = () => {
        reqGetNewsCategories().then(res => {
            console.log(res);
            setNewsCategories(res.data.categoryList)
        })
    }
    const handlePrev = () => {
        setCurrent(current - 1)
    }
    useEffect(() => {
        getNewsCategories()
    }, [])
    return (
        <div>
            <Steps
                current={current}
                items={[
                    {
                        title: '基本信息',
                        description: '新闻标题，新闻分类'
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主题内容'
                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核'
                    },
                ]}
            />

            <div className={current === 0 ? '' : style.active}>
                <Form
                    name="basic"
                    form={NewsForm}
                    style={{marginTop:'50px'}}
                    autoComplete="off"
                >
                    <Form.Item
                        label="新闻标题"
                        name="label"
                        rules={[
                            {
                                required: true,
                                message: '请输入新闻标题!',
                            },
                        ]}
                    >
                        <Input placeholder='请输入新闻标题'/>
                    </Form.Item>

                    <Form.Item
                        label="新闻类别"
                        name="categoryId"
                        rules={[
                            {
                                required: true,
                                message: '请选择新闻类别',
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            placeholder='请选择新闻类别'
                            fieldNames={{'value': 'id'}}
                            style={{
                                width: 250,
                            }}
                            options={newsCategories}
                        />
                    </Form.Item>
                </Form>
            </div>

            <div className={current === 1 ? '' : style.active}>
                <NewsEdit getContent={(value) => {
                    console.log(value);
                    setContent(value)
                }}/>
            </div>

            <div style={{ marginTop: '50px', padding: '20px' }}>
                {
                    current === 2 && <span><Button onClick={() => handleSaveOrExamine(0)} type='primary' style={{ marginRight: '20px' }}>保存至草稿箱</Button>
            <Button onClick={() => handleSaveOrExamine(1)} style={{ marginRight: '20px' }} danger>提交审核</Button></span>
                }
                {
                    current < 2 && <Button type='primary' style={{ marginRight: '20px' }} onClick={() => handleNext()}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={() => handlePrev()}>上一步</Button>
                }


            </div>
        </div>
    )
}
export default NewsAdd