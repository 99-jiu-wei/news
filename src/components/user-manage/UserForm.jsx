import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select

const UserForm = (props, ref) => {
    //超级管理员区域禁用
    const [isDisable, setIsDisable] = useState(false)
    useEffect(() => {
        setIsDisable(props.updateDisable)
    }, [props.updateDisable])

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
                        return <Option value={item.value} key={item.id}>{item.title}</Option>
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
                        return <Option value={item.id} key={item.id}>{item.roleName}</Option>
                    })}
                </Select>
            </Form.Item>
        </Form>
    )
}
export default forwardRef(UserForm) 