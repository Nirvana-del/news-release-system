export interface News {
    id: string;
    // title: string;
    label: string;
    author: string;
    content: string;
    categoryId: number;
    region: string;
    roleId: number;
    auditState: number; // 0 未审核(草稿) 1 审核中 2 审核ok 3 审核 rejected
    publishState: number; // 0 未发布 1 已发布
    view: number;
    star: number;
    createTime: number;
    publishTime: number;
    category?: Category;
}

export interface Category {
    id?: number;
    // title: string;
    label: string;
    value: string;
}

export interface Option {
    value: number;
    name: string;
}
