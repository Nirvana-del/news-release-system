import axios from 'axios'
import { store } from '@/redux'

const request  = axios.create({
    baseURL:'http://localhost:8090',
    timeout:5000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
request.interceptors.request.use((config)=>{
    store.dispatch({
        type: 'CHANGE_LOADING',
        payload: true
    })
    return config;
})

request.interceptors.response.use((res)=>{
    store.dispatch({
        type: 'CHANGE_LOADING',
        payload: false
    })
    return res.data;

},(err)=>{
    console.log(err)
    store.dispatch({
        type: 'CHANGE_LOADING',
        payload: false
    })
    return Promise.reject(new Error('fail'))
})


export default request;