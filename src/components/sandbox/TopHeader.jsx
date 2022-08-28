import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: "超级管理员"
                },
                {
                    key: '2',
                    danger: true,
                    label: '退出',
                },
            ]}
        />
    )
    return (
        <Header
            className="site-layout-background"
            style={{
                padding: 0,
            }}
        >
            {collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
            <div style={{ float: "right", margin: "0 10px" }}>
                <span style={{ margin: "0 10px" }}>欢迎admin回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header>
    )
}
