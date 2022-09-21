import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from "../../views/sandbox/home/Home"
import UserList from "../../views/sandbox/user-manage/UserList"
import RoleList from "../../views/sandbox/right-manage/RoleList"
import RightList from "../../views/sandbox/right-manage/RightList"
import Nopremission from '../../views/sandbox/nopremission/Nopremission'
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd"
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft"
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory"
import Unpublished from "../../views/sandbox/publish-manage/Unpublished"
import Published from "../../views/sandbox/publish-manage/Published"
import Sunset from "../../views/sandbox/publish-manage/Sunset"
import Audit from "../../views/sandbox/audit-manage/Audit"
import AuditList from "../../views/sandbox/audit-manage/AuditList"
import axios from 'axios'



export default function NewsRouter() {
    const [backRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            // console.log(res);
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data]);
        })

    }, [])
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        //删除路由和关闭路由
        return LocalRouterMap[item.key] && item.pagepermisson
    }
    const checkUserPermission = (item) => {
        //当前登录用户中包含这个权限
        return rights.includes(item.key)
    }
    const LocalRouterMap = {
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
        "/news-manage/add": NewsAdd,
        "/news-manage/draft": NewsDraft,
        "/news-manage/category": NewsCategory,
        "/audit-manage/audit": Audit,
        "/audit-manage/list": AuditList,
        "/publish-manage/unpublished": Unpublished,
        "/publish-manage/published": Published,
        "/publish-manage/sunset": Sunset
    }
    return (
        <Switch>
            {
                backRouteList.map(item => {
                    // checkRoute，checkUserPermission用来确定路由权限

                    if (checkRoute(item) && checkUserPermission(item)) {
                        return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />

                    } else {
                        return null
                    }
                })

            }

            <Redirect from='/' to='/home' exact />
            {backRouteList.length > 0 && <Route path='*' component={Nopremission} />}
        </Switch>
    )
}
