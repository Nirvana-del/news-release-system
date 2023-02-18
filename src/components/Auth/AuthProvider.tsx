import React, {
    createContext,
    lazy,
    LazyExoticComponent,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react'
import {AuthProviderValue, routePath} from "@/components/Auth/types/auth-provider";
import {reqGetUserInfo, reqLogin} from "@/api/user";
import {get_Token, get_UserInfo, set_Token, set_UserInfo } from "@/utils/handleToken";
import {User} from "@/views/user-manage/types";
import {useLocation, useNavigate} from "react-router-dom";
import {message, Spin} from "antd";
import {Permission} from "@/views/permission-manage/types/permission";
import request from "@/utils/request";
import {reqGetPermissionTree} from "@/api/permission";
import Cookie from "js-cookie";
const Home = lazy(() => import('@/views/Home'))
const UserList = lazy(() => import('@/views/user-manage/UserList'))
const RoleList = lazy(() => import('@/views/permission-manage/RoleList'))
const RightList = lazy(() => import('@/views/permission-manage/RightList'))
const NewsAdd = lazy(() => import('@/views/news-manage/NewsAdd'))
const NewsDraft = lazy(() => import('@/views/news-manage/NewsDraft'))
const NewsCategory = lazy(() => import('@/views/news-manage/NewsCategory'))
const AuditNews = lazy(() => import('@/views/audit-manage/AuditNews'))
const AuditList = lazy(() => import('@/views/audit-manage/AuditList'))
const Unpublished = lazy(() => import('@/views/publish-manage/Unpublished'))
const Published = lazy(() => import('@/views/publish-manage/Published'))
const Sunset = lazy(() => import('@/views/publish-manage/Sunset'))
// 去更新新闻
const NewsUpdate = lazy(() => import('@/views/news-manage/NewsUpdate'))
const NewsPreview = lazy(() => import('@/views/news-manage/NewsPreview'))
const withLoadingComponent = (Comp: LazyExoticComponent<any>) => (
        <Suspense fallback={<Spin size="large" tip='用户查询中'></Spin>}>
            <Comp/>
        </Suspense>
)
const routesMap = {
    "/home": withLoadingComponent(Home),
    "/user-manage/list": withLoadingComponent(UserList),
    "/right-manage/role/list": withLoadingComponent(RoleList),
    "/right-manage/right/list": withLoadingComponent(RightList),
    "/news-manage/add": withLoadingComponent(NewsAdd),
    "/news-manage/draft": withLoadingComponent(NewsDraft),
    "/news-manage/category": withLoadingComponent(NewsCategory),
    "/news-manage/preview/:id": withLoadingComponent(NewsPreview),
    "/news-manage/update/:id": withLoadingComponent(NewsUpdate),
    "/audit-manage/audit": withLoadingComponent(AuditNews),
    "/audit-manage/list": withLoadingComponent(AuditList),
    "/publish-manage/unpublished": withLoadingComponent(Unpublished),
    "/publish-manage/published": withLoadingComponent(Published),
    "/publish-manage/sunset": withLoadingComponent(Sunset)

}
const whiteList = ['/login', '/news-list', '/news-detail']
export const AuthContext = createContext<AuthProviderValue>({
    handleLogin: () => {
    },
    handleLogout: () => {
    },
    user: {role: {pathList: []}},
    rightTree: [],
    loading: false,
    routeList: []
})

interface Props {
    children: React.ReactNode
}

const AuthProvider: React.FC<Props> = (props) => {
    const token = get_Token()
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState<Partial<User>>(get_UserInfo)
    const [rightTree, setRightTree] = useState<Permission[]>([]);
    const [loading] = useState(false);
    const [routeList, setRouteList] = useState<routePath[]>([]);
    // 获取动态路由列表
    const getRouteList = () => {
        Promise.all([
            request.get('/rights/list'),
            request.get('/sub_rights/list')
        ]).then(([rightsRes, subRightsRes]) => {
            let list = [...rightsRes.data.rightsList, ...subRightsRes.data.subRightsList]
            list = list.map(item => {
                const {path, pagePermission, routePermission} = item
                return {
                    path,
                    element: routesMap[path],
                    pagePermission,
                    routePermission
                }
            }).filter(item => {
                // 筛选有权限的列表
                const {pagePermission, routePermission} = item
                return ((pagePermission === 1 || routePermission === 1) && item.element !== undefined)
            })
            setRouteList(list);
        })
    }
    // 获取权限树（生成侧边栏）
    const getPermissionTree = () => {
        reqGetPermissionTree().then(res => {
            console.log(res.data.rightTree)
            setRightTree(res.data.rightTree)
        })
    }
    useEffect(() => {
        // 没有 token 时不生成需要权限的路由
        if (!token) {
            return
        } else {
            // 访问没有权限的路由，则不需要生成动态路由列表
            if (!whiteList.includes(location.pathname || '')) {
                initData()
            }
        }
    }, [])
    const initData = () => {
        getRouteList()
        getPermissionTree()
    }
    const handleLogin = useCallback((username: string, password: string) => {
        const in5Minutes = 1 / 48 / 6
        reqLogin(username, password).then((res: any) => {
            const {code, data: {token}} = res
            if (code === 200) {
                // 将 token 存入 cookie
                set_Token(token,in5Minutes)
                initData()
                // 通过 token 获取当前用户信息并将其全局数据共享
                reqGetUserInfo().then((res: any) => {
                    const userInfo = res.data.userInfo
                    setUser(userInfo)
                    // 将用户信息到 cookie 中
                    set_UserInfo(userInfo, in5Minutes)
                    navigate('/home')
                })
            } else {
                message.error('用户名或密码错误').then(r => console.log(r))
            }
        })
    }, []);
    const handleLogout = useCallback(() => {
        Cookie.remove('token')
        Cookie.remove('userInfo')
        setRightTree([])
        setUser({})
        navigate('/login')
    }, [])

    const globalValue = useMemo(() => {
        return {
            handleLogin,
            handleLogout,
            rightTree,
            user,
            loading,
            routeList
        }
    }, [handleLogin, handleLogout, rightTree, routeList]);
    return (
        <AuthContext.Provider value={globalValue}>
            {props.children}
        </AuthContext.Provider>
    )
}
export default AuthProvider