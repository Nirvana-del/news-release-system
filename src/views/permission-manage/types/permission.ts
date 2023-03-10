export interface Permission {
    id: number;
    // title: string;
    label: string;
    // key: string;
    path: string;
    pagePermission: number;
    grade: number; // 等级
    // 下面是二级权限的字段
    rightId?: number;
    children?: Permission[];
    // 前端：图标
    icon?: string;
}

export interface rightsMap {
    parentRights:Permission [], // 一级路由数组
    subRights: Permission [] // 二级路由数组
}