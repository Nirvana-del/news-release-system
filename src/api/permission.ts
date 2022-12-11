import requests from '../utils/request'
import {Permission} from "@/views/permission-manage/types/permission";

// 获取权限树
export const reqGetPermissionTree = () => {
    return requests.get(`/rights/tree`);
}

// 删除权限
export const deletePermission = (id:number) => {
    return requests.delete(`/rights/${id}`);
}

// 更新权限
export const updatePermission = (item:Permission) => {
    return requests.patch(`/rights/${item.id}`,{
        pagePermission: item.pagePermission
    });
}

// 删除次级权限
export const deleteChildPermission = (id:number) => {
    return requests.delete(`/sub_rights/${id}`);
}

// 更新次级权限
export const updateChildPermission = (item:Permission) => {
    return requests.patch(`/sub_rights/${item.id}`,{
        pagePermission: item.pagePermission
    });
}
