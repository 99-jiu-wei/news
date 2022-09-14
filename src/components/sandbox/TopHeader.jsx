import React, { useState } from 'react'
import { withRouter } from 'react-router';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
const { Header } = Layout;

function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"))
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: roleName
                },
                {
                    key: '2',
                    danger: true,
                    label: '退出',
                    onClick: () => {
                        localStorage.removeItem("token");
                        props.history.replace("/login")
                    }
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
                <span style={{ margin: "0 10px" }}>
                    欢迎<strong style={{ color: '#1890ff' }}>{username}</strong>回来
                </span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header>
    )
}
export default withRouter(TopHeader)