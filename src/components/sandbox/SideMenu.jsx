import React from 'react'
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router';
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import './index.css'
import { menuList } from './MenuList'
const { SubMenu } = Menu;
const { Sider } = Layout;

//官方案例
// function getItem(label, key, icon, children, type) {
//     return {
//         key,
//         icon,
//         children,
//         label,
//         type,
//     };
// }
// const items = [
//     getItem('首页', '/home', <UserOutlined />),
//     getItem('Navigation Two', '2', <VideoCameraOutlined />),
//     getItem('Navigation Three', '3', <UploadOutlined />, [
//         getItem('Option 9', '9'),
//         getItem('Option 10', '10'),
//         getItem('Option 11', '11'),
//         getItem('Option 12', '12'),
//     ])
// ];

function SideMenu(props) {
    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children) {
                return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => {
                    console.log(props);
                    props.history.push(item.key)
                }}
            >{item.title}</Menu.Item>
        })
    }
    return (
        // Layout.Sider-->collapsible(是否可收起) collapsed(当前收起状态)
        <Sider trigger={null} collapsible collapsed={false}>
            <div className="logo" >全球新闻发布管理系统</div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
            >
                {renderMenu(menuList)}
            </Menu>
        </Sider>
    )
}
export default withRouter(SideMenu);
