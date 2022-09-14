import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select

const UserForm = (props, ref) => {
    //超级管理员区域禁用
    const [isDisable, setIsDisable] = useState(false)
    useEffect(() => {
        setIsDisable(props.updateDisable)
    }, [props.updateDisable])
    //如果是超级管理员
    const { roleId, region } = JSON.parse(localStorage.getItem("token"))
    //枚举映射
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }
    //控制地区下拉菜单的禁用
    const checkRegionDisabled = (item) => {
        if (props.isUpdate) {//更新状态
            if (roleObj[roleId] === "superadmin") {//超级管理员
                return false//不禁用
            } else {
                return true
            }

        } else {
            if (roleObj[roleId] === "superadmin") {//超级管理员
                return false//不禁用
            } else {//跟我管理的区域相同的不禁用
                return item.value !== region
            }
        }
    }
    //控制角色下拉菜单的禁用
    const checkRoleDisabled = (item) => {
        if (props.isUpdate) {//更新状态
            if (roleObj[roleId] === "superadmin") {//超级管理员
                return false//不禁用
            } else {
                return true
            }

        } else {
            if (roleObj[roleId] === "superadmin") {//超级管理员
                return false//不禁用
            } else {//管理员--只有编辑不禁用
                return roleObj[item.id] !== "editor"
            }
        }
    }
    return (
        <Form
            layout="vertical"
            ref={ref}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[//校验
                    {
                        required: true,
                        message: '用户名不能为空',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[//校验
                    {
                        required: true,
                        message: '密码不能为空',
                    },
                ]}
            >
                <Input type='password' />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={//如果是禁用状态，改变校验规则，使表单能够提交
                    isDisable ? [] : [
                        {
                            required: true,
                            message: '用户名不能为空',
                        },
                    ]}
            >
                <Select disabled={isDisable}>
                    {props.regionList.map(item => {
                        return <Option value={item.value}
                            key={item.id}
                            disabled={checkRegionDisabled(item)}
                        >{item.title}</Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[//校验
                    {
                        required: true,
                        message: '用户名不能为空',
                    },
                ]}
            >
                <Select onChange={(value) => {
                    // console.log(value);
                    if (value === 1) {
                        setIsDisable(true)
                        //清空选中之后禁用的内容
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setIsDisable(false)
                    }
                }}>
                    {props.roleList.map(item => {
                        return <Option
                            value={item.id}
                            key={item.id}
                            disabled={checkRoleDisabled(item)}
                        >{item.roleName}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form>
    )
}
export default forwardRef(UserForm) 