import requests from '../utils/request'

// 获取区域列表
export const reqGetRegionList = () => {
    return requests.get(`/regions`);
}

