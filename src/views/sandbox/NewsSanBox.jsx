import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from "../sandbox/home/Home"
import UserList from "./user-manage/UserList"
import RoleList from "./right-manage/RoleList"
import RightList from "./right-manage/RightList"
import Nopremission from './nopremission/Nopremission'
//antd
import "./NewsSanBox.css"
const { Content } = Layout;

export default function NewsSanBox() {
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Switch>
                        <Route path='/home' component={Home} />
                        <Route path='/user-manage/list' component={UserList} />
                        <Route path='/right-manage/role/list' component={RoleList} />
                        <Route path='/rigth-manage/right/list' component={RightList} />

                        <Redirect from='/' to='/home' exact />
                        <Route path='*' component={Nopremission} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}

