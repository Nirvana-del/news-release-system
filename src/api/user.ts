import requests from '../utils/request'
import {User} from "@/views/user-manage/types";

// 获取用户列表
export const reqGetUserList = () => {
    return requests.get(`/users/list`);
}

// 添加用户
export const reqAddUser = (values: Partial<User>) => {
    return requests.post(`/users`, {
        ...values,
        roleState: true,
        userDefault: false
    });
}

// 删除用户
export const reqDeleteUser = (id:string) => {
    return requests.delete(`/users/${id}`);
}

// 更新用户信息
export const reqUpdateUser = (id:string, userinfo:Partial<User>) => {
    return requests.patch(`/users/${id}`,{
        ...userinfo
    });
}

// 登陆
export const reqLogin = (username:string, password:string) => {
    return requests({
        method:'post',
        url:'/users/login',
        data:{
            username,
            password
        }
    })
}

// 查询用户（根据token）
export const reqGetUserInfo = () => requests.get('/users')
