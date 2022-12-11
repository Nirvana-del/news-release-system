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
import {reqLogin} from "@/api/user";
import {setToken} from "@/utils/handleToken";
import {User} from "@/views/user-manage/types";
import {useLocation, useNavigate} from "react-router-dom";
import {message, Spin} from "antd";
import {Permission} from "@/views/permission-manage/types/permission";
import request from "@/utils/request";
import {reqGetPermissionTree} from "@/api/permission";
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

const withLoadingComponent = (Comp:LazyExoticComponent<any>) => (
    <Suspense fallback={<Spin size="large" tip='用户查询中'></Spin>}>
       <Comp />
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
    tokenStr: '',
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
    // console.log('AuthProvider')
    const jsonStr = localStorage.getItem('user')

    const navigate = useNavigate()
    const location = useLocation()
    let _user: Partial<User> = {
        id: '',
        username: '',
        role: {pathList: []}
    }
    if (jsonStr) _user = JSON.parse(jsonStr)

    const [tokenStr, setTokenStr] = useState<string | null>('')
    const [user, setUser] = useState<Partial<User>>(_user)
    const [rightTree, setRightTree] = useState<Permission[]>([]);
    const [loading] = useState(false);

    const [routeList, setRouteList] = useState<routePath[]>([]);
    const getRouteList = () => {
        return Promise.all([
            request.get('/rights/list'),
            request.get('/sub_rights/list')
        ])
    }

    const getPermissionTree = () => {
        return reqGetPermissionTree()
    }
    const checkUserPermission = (path: string) => {
        return user.role?.pathList?.includes(path)
    }

    useEffect(() => {
        // 没有token时阻止访问需要权限的路由
        if (!jsonStr) {
            if (location.pathname !== '/login')
                navigate('/login')
            return
        } else {
            // 访问没有权限的路由，则不需要生成动态路由列表
            if (whiteList.includes(location.pathname)) {
                // 特殊情况：有权限的状态下阻止直接访问登录界面
                if (location.pathname === '/login')
                    navigate('/')
                else return
            }
        }

        // 获取动态路由
        getRouteList().then(([rightsRes, subRightsRes]) => {
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
                return ((pagePermission === 1 || routePermission === 1) && item.element !== undefined && checkUserPermission(item.path))
            })
            // console.log(list);
            setRouteList(() => list);
            // console.log('设置', list);
        })
        // 获取权限树
        getPermissionTree().then(res => {
            // console.log('权限树', res.data)
            setRightTree(res.data.rightTree)
        })

    }, [tokenStr])
    const handleLogin = useCallback((username: string, password: string) => {
        reqLogin(username, password).then((res: any) => {
            const {code, data} = res
            if (code === 200) {
                // 登录成功
                setTokenStr('token-xxx')
                // 存内存
                setToken('token-xxx')
                setUser(data.userInfo)
                localStorage.setItem('user', JSON.stringify(data.userInfo))
                navigate('/home')
            } else {
                message.error('用户名或密码错误').then(r => console.log(r))
            }
        })
    }, []);
    const handleLogout = useCallback(() => {
        setTokenStr('')
        localStorage.clear()
        navigate('/login')
    }, [])

    const globalValue = useMemo(() => {
        return {
            tokenStr,
            handleLogin,
            handleLogout,
            rightTree,
            user,
            loading,
            routeList
        }
    }, [tokenStr, handleLogin, handleLogout, rightTree, routeList]);
    return (
        <AuthContext.Provider value={globalValue}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthProvider