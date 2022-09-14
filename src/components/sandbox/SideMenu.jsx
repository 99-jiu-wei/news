import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router';
import axios from "axios";
import {
    HomeOutlined,
    SafetyOutlined,
    FileTextOutlined,
    CloudOutlined,
    ReconciliationOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './index.css'
// import { menuList } from './MenuList'
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

//定义图标的映射数组
const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <SafetyOutlined />,
    "/news-manage": <FileTextOutlined />,
    "/audit-manage": <ReconciliationOutlined />,
    "/publish-manage": <CloudOutlined />
}
function SideMenu(props) {
    const [menu, setMenu] = useState([])
    //json-server取渲染menu的数据
    useEffect(() => {
        axios.get("http://localhost:8000/rights?_embed=children").then(res => {
            // console.log(res.data);
            setMenu(res.data)
        })
    }, [])
    //判断是否有子菜单
    const checkPagePermission = (item) => {
        //pagepermisson---菜单权限
        return item.pagepermisson && rights.includes(item.key);
    }
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const renderMenu = (menu) => {
        return menu.map(item => {
            //有子菜单
            //判断是否有子菜单：item.children?.length>0
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item
                key={item.key}
                icon={iconList[item.key]}
                onClick={() => {
                    // 点击进行跳转--高阶组件---historyAPI
                    props.history.push(item.key)
                }}
            >{item.title}</Menu.Item>
        })
    }
    //路径--和选中菜单的哪项相匹配
    const selectKeys = [props.location.pathname];
    //路径的一级路由--和展开项匹配
    const openKeys = ["/" + props.location.pathname.split("/")[1]];
    return (
        // Layout.Sider-->collapsible(是否可收起) collapsed(当前收起状态)
        <Sider trigger={null} collapsible collapsed={false}>
            {/* 弹性布局--只让sidemenu有滚动条 */}
            <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
                <div className="logo" >全球新闻发布管理系统</div>
                <div style={{ flex: 1, overflow: "auto" }}>
                    {/* defaultSelectedKeys--默认选中--[] */}
                    {/* defaultOpenKeys--初始展开的菜单项 */}
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={selectKeys}
                        defaultOpenKeys={openKeys}
                    >
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
export default withRouter(SideMenu);
