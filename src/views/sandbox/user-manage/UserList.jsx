import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Switch, Modal } from 'antd'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons"
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setDataSource] = useState([])
    const [isAddVisible, setIsAddVisible] = useState(false)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false)
    const [updateDisable, setUpdateDisable] = useState(false)
    const [roleList, setRoleList] = useState([])
    const [regionList, setRegionList] = useState([])
    //存放更新的哪条item
    const [current, setCurrent] = useState(null)

    const addForm = useRef(null)
    const updateForm = useRef(null)
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
    const deleteMethod = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`http://localhost:8000/users/${item.id}`)
    }
    const handleChange = (item) => {
        console.log(item);
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`http://localhost:8000/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    const handleUpdate = (item) => {
        setTimeout(() => {
            setIsUpdateVisible(true)
            if (item.roleId === 1) {
                //禁用
                setUpdateDisable(true)
            } else {
                //不禁用
                setUpdateDisable(false)
            }
            //动态设置表单数据,因为还没有真实DOM
            updateForm.current.setFieldsValue(item)
            //保存更新的那条item数据
            setCurrent(item);
        }, 0)//放到异步队列中
    }
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })), {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === "全球") {
                    //因为后端去全球是空字符串
                    return item.region === ""
                }
                return item.region === value
            },
            render: (region) => {
                return <b>{region ? region : '全球'}</b>
            }
        }, {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        }, {
            title: '用户名',
            dataIndex: 'username'
        }, {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch
                    checked={roleState}
                    disabled={item.default}
                    onChange={() => { handleChange(item) }}
                />
            }
        }, {
            title: '操作',
            render: (item) => {
                return (
                    <>
                        <Button
                            danger
                            shape='circle'
                            icon={<DeleteOutlined />}
                            style={{ marginRight: "10px" }}
                            disabled={item.default}
                            onClick={() => { confirmDelete(item) }}
                        />
                        <Button
                            type='primary'
                            shape='circle'
                            icon={<EditOutlined />}
                            disabled={item.default}
                            onClick={() => { handleUpdate(item) }}
                        />
                    </>
                )
            }
        }
    ]
    useEffect(() => {
        axios.get(`http://localhost:8000/users?_expand=role`).then(res => {
            setDataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:8000/roles`).then(res => {
            setRoleList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:8000/regions`).then(res => {
            setRegionList(res.data)
        })
    }, [])
    const addFormOk = () => {
        addForm.current.validateFields().then(value => {
            // console.log(value);
            setIsAddVisible(false)
            addForm.current.resetFields();
            //post到后端，生成id（后端自增长），再设置 datasource,方便后面更新和删除
            axios.post(`http://localhost:8000/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                setDataSource([
                    ...dataSource,
                    {
                        ...res.data,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }
                ])
            })
        }).catch(err => {
            console.log(err);
        })
    }
    const updateFormOk = () => {
        updateForm.current.validateFields().then(value => {
            // console.log(value);
            setIsUpdateVisible(false)
            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item;
            }))
            // setUpdateDisable(!updateDisable)
            axios.patch(`http://localhost:8000/users/${current.id}`, value)
        })
    }
    return (
        <div>
            <Button type='primary' onClick={() => { setIsAddVisible(true) }}>添加用户</Button>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />
            <Modal
                visible={isAddVisible}
                title="创建用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setIsAddVisible(false)
                }}
                onOk={() => { addFormOk() }}

            >
                <UserForm
                    regionList={regionList}
                    roleList={roleList}
                    ref={addForm}
                />
            </Modal>
            {/* 更新 */}
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                    //强制刷新
                    setUpdateDisable(!updateDisable)
                }}
                onOk={() => { updateFormOk() }}

            >
                <UserForm
                    regionList={regionList}
                    roleList={roleList}
                    ref={updateForm}
                    updateDisable={updateDisable}
                />
            </Modal>
        </div>
    )
}
