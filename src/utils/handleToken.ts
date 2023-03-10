import Cookie from 'js-cookie'
import {User} from "@/views/user-manage/types";
export const get_Token = () => {
    return Cookie.get('token') || null
}

export const set_Token = (token:string, time_limit:number) => {
    Cookie.set('token', token, {
        expires: time_limit
    })
}

export const get_UserInfo = () => {
    return JSON.parse(Cookie.get('userInfo') || '{}')
}

export const set_UserInfo = (userInfo:Partial<User>, time_limit:number) => {
    // const in30Minutes = 1 / 48
    Cookie.set('userInfo', JSON.stringify(userInfo), {
        expires: time_limit
    })
}
