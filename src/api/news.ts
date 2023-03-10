import request from '../utils/request.js'
import {Category, News} from "@/views/news-manage/types";

// 获取新闻类别
export const reqGetNewsCategories = () => {
    return request.get(`/categories`);
}

// 删除新闻类别
export const reqDeleteNewsCategory = (id:number) => {
    return request.delete(`/categories/${id}`);
}

// 更新新闻类别信息
export const reqUpdateNewsCategory = (id:number, category:Category) => {
    const { label } = category
    return request.patch(`/categories/${id}`,{
        label,
        value:label
    });
}

// 新增新闻类别信息
export const reqAddNewsCategory = (category:Category) => {
    return request.post(`/categories`,{
        ...category
    });
}

// 新增新闻
export const reqAddNews = (news:News) => {
    return request.post(`/news`,{
        ...news
    });
}

// 更新新闻内容
export const reqUpdateNews = (id:string, news:Partial<News>) => {
    return request.patch(`/news/${id}`,{
        ...news
    });
}

// 将草稿箱内容上传至审核列表
export const reqSendNews = (id:string) => {
    return request.patch(`/news/${id}`,{
        auditState: 1
    });
}

// 删除新闻
export const reqDeleteNews = (id:string) => {
    return request.delete(`/news/${id}`);
}

// 草稿列表
export const reqGetDraftList = (username:string) => {
    return request.get(`/news/draft_list?author=${username}`)
}

// 当前用户的审核列表
export const reqGetUserAuditList = (username:string) => {
    return request.get(`/news/audit_list?author=${username}`)
}

// 获取处于审核状态的新闻列表
export const reqGetAuditList = () => {
    return request.get(`/news/drafts`)
}

// 通过发布状态获取当前用户的新闻列表
export const reqGetNewsListByPublishState = (publishState:number,username:string) => {
    return request.get(`/news/publish_list/${publishState}?author=${username}`)
}

// 获取已下线的新闻列表
export const reqGetOfflineNewsList = () => {
    return request.get(`/news/sunset_list`)
}

// 新闻详情
export const reqGetNewsDetail = (id:string) => {
    return request.get(`/news/detail/${id}`)
}

// 获取用户最常浏览的新闻列表
export const reqGetMostBrowsingNews = () => {
    return request.get(`/news/most_browsing`)
}

// 获取用户点赞最多的新闻列表
export const reqGetMostLikesNews = () => {
    return request.get(`/news/most_like`)
}

// 获取所有已发布的新闻列表
export const reqGetAllPublishedNews = () => {
    return request.get(`/news/published_list`)
}