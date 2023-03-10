import React, {useEffect} from 'react'
import styles from './index.module.scss'
import {Button, Checkbox, Form, Input, Spin} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {useAuthContext} from "@/components/Auth/hooks/useAuthContext";
import ParticlesBackground from "@/views/Login/ParticlesBackground";
import Cookie from 'js-cookie';
// import { enc, mode, AES, pad } from 'crypto-js';
import { enc, AES } from 'crypto-js';
import {connect} from "react-redux";
interface LoadingOutletProps {
    loading:boolean
}
const Login: React.FC<LoadingOutletProps> = (props) => {
    const { loading } = props
    const {handleLogin} = useAuthContext()
    const onFinish = (values: any) => {
        const { username, password, remember } = values
        handleLogin(username, password)
        if(remember){
            Cookie.set('userName', username, {
                expires: 5
            })
            Cookie.set('userPwd', AES.encrypt(password,'sssg'), {
                expires: 5 // 存储5天
            })
        }else {
            // 删除cookie
            Cookie.remove('userName')
            Cookie.remove('userPwd')
        }
    }
    const [form] = Form.useForm()
    useEffect(() => {
        const enUsername = Cookie.get('userName') ? Cookie.get('userName') : '';
        const enPassword = Cookie.get('userPwd') ? Cookie.get('userPwd') : '';
        if (enPassword) {
            // 对密码进行解密
            const pwd = AES.decrypt(enPassword,'sssg').toString(enc.Utf8)
            // 将是否记住密码置为true
            form.setFieldsValue({
                username: enUsername,
                password: pwd,
                remember: true
            })
        } else {
            form.setFieldsValue({
                username: '',
                password: '',
                remember: true
            })
        }
    },[])
    return (
        <div className={styles.wrap}>
            <div className="example" style={{
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px'
            }}>
                <Spin size='large' spinning={loading} style={{
                    marginTop: '20%'
                }} >
                    <ParticlesBackground/>
                    <div className={styles.formContainer}>
                        <div className={styles.loginTitle}>新闻发布管理系统</div>
                        <Form
                            form={form}
                            name="normal_login"
                            className={styles.loginForm}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入您的账号',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined/>} placeholder="输入账号" autoComplete={'off'}/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入您的密码',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined/>}
                                    type="password"
                                    autoComplete={"off"}
                                    placeholder="输入密码"
                                />
                            </Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle >
                                <Checkbox className={styles.remember} >记住密码</Checkbox>
                            </Form.Item>
                            <Form.Item label-width="auto">
                                <div className={styles.loginButtonWrap}>
                                    <Button type="primary" htmlType="submit" className={styles.loginButton}>
                                        登录
                                    </Button>
                                </div>

                            </Form.Item>

                            {/*<Form.Item>*/}
                            {/*  */}
                            {/*    <a>*/}
                            {/*        Forgot password*/}
                            {/*    </a>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item>*/}
                            {/*    <Button type="primary" htmlType="submit" className="login-form-button">*/}
                            {/*        Log in*/}
                            {/*    </Button>*/}
                            {/*    Or <a>register now!</a>*/}
                            {/*</Form.Item>*/}
                        </Form>
                    </div>
                </Spin>
            </div>

        </div>
    )
}
const mapStateToProps = (state:any) => {
    const { LoadingReducer: { loading } } = state
    return {
        loading
    }
}
export default connect(mapStateToProps)(Login)
