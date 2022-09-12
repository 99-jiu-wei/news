import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import axios from 'axios'

const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8000/rights?_embed=children").then(res => {
            // 树形数据展示--children为空
            const list = res.data
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = ""
                }
            })
            setDataSource(list)
        })
    }, [])
    //确定删除的弹框
    const confirmDelete = (item) => {
        confirm({
            title: '你确定要删除吗？',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    //真正确定删除要做的事
    const deleteMethod = (item) => {
        console.log(item);
        //当前页面同步状态+后端同步
        //grade属性判断是一级还是二级
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`http://localhost:8000/rights/${item.id}`)
        } else {
            //rightId--上一级的id
            console.log(item.rightId);
            //不改变dataSource---找到一级遍历--filter只能控制一级
            let list = dataSource.filter(data => data.id === item.rightId)
            //改变list--找到对应的id删除
            console.log(list);
            //filter改变不了一级，但是二级已经改变
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            //...解构浅拷贝，不能直接用dataSource
            console.log(dataSource);
            setDataSource([...dataSource])
            axios.delete(`http://localhost:8000/children/${item.id}`)


        }
    }
    const columns = [
        {
            // 表格title
            title: 'ID',
            // 后端数据对应的属性名
            dataIndex: 'id',
            // key: 'name',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            // key: 'age',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
            // key: 'address',
        },
        {
            title: "操作",
            //没有dataIndex,传入整个对象
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined />} style={{ marginRight: "10px" }} onClick={() => { confirmDelete(item) }} />
                        <Popover
                            content={<div style={{ textAlign: "center" }}><Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} /></div>}
                            title="页面配置项"
                            //解决按钮禁用，但是仍能点击触发的bug
                            trigger={item.pagepermisson === undefined ? '' : "click"}
                        >
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                                //不是菜单项的编辑按钮禁用
                                disabled={item.pagepermisson === undefined}
                            />
                        </Popover>
                    </div>
                )
            }
        }
    ]
    const switchMethod = (item) => {
        // console.log(item);
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`http://localhost:8000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:8000/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                // pagination--配置分页--防止出现滚动条
                pagination={{
                    pageSize: 5
                }}
            />
        </div>
    )
}

