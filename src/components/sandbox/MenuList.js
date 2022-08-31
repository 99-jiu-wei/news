import { UserOutlined } from '@ant-design/icons'
export const menuList = [
    //动态生成侧边栏---后端返回数组的格式
    //用路径当做key值
    {
        key: "/home",
        icon: <UserOutlined />,
        title: "首页"
    }, {
        key: "/user-manage",
        icon: <UserOutlined />,
        title: "用户管理",
        children: [
            {
                key: "/user-manage/list",
                icon: <UserOutlined />,
                title: "用户列表"
            }
        ]
    }, {
        key: "/right-manage",
        icon: <UserOutlined />,
        title: "权限管理",
        children: [
            {
                key: "/right-manage/role/list",
                icon: <UserOutlined />,
                title: "角色列表"
            },
            {
                key: "/right-manage/right/list",
                icon: <UserOutlined />,
                title: "权限列表"
            }
        ]
    }
]