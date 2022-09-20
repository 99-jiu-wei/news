import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined } from "@ant-design/icons"
import axios from 'axios'
const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([])//渲染表格数据
    const [rightList, setRightList] = useState([])//渲染树形
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
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
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
    }
    const handleOk = () => {
        console.log(currentRights);
        //修改后，重新映射datasource
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        setIsModalOpen(false)
        //patch
        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        }, {
            title: '角色名称',
            dataIndex: 'roleName'
        }, {
            title: "操作",
            //没有dataIndex,传入整个对象
            render: (item) => {
                return (
                    <div>
                        <Button danger shape="circle" icon={<DeleteOutlined />} style={{ marginRight: "10px" }} onClick={() => { confirmDelete(item) }} />
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<UnorderedListOutlined />}
                            onClick={() => {
                                setIsModalOpen(true)
                                setCurrentRights(item.rights)
                                setCurrentId(item.id)
                            }}
                        />
                    </div>
                )
            }
        }
    ]
    useEffect(() => {
        axios.get(`/roles`).then(res => {
            // console.log(res.data);
            setDataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`/rights?_embed=children`).then(res => {
            setRightList(res.data)
        })
    }, [])
    const onCheck = (checkedKeys) => {
        // console.log(checkedKeys);
        setCurrentRights(checkedKeys.checked)
    }
    return (
        <div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={item => item.id}
            />
            <Modal title="权限分配" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    //与上一级脱离关系
                    checkStrictly={true}
                    onCheck={onCheck}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
