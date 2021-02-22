import {Button, Col, Form, Input, Row, Typography} from 'antd';
import React, {ChangeEvent, useState} from 'react';

const Register = () => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [pw1, setPw1] = useState<string>('');
    const [pw2, setPw2] = useState<string>('');

    const handleBlur = (setter: (value: string) => void) => () => {
        setter(activeValue);
        setActiveInput(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleSubmit = () => {
        console.log({
           email, pw1, pw2
        });
    };

    return (
        <div>
            <Row>
                <Col span={8} offset={8}>
                    <Typography.Title>Register</Typography.Title>
                    <Form
                        labelCol={{span: 8}}
                        wrapperCol={{span: 14}}
                    >
                        <Form.Item label="Email" name="email">
                            <Input
                                onBlur={handleBlur(setEmail)}
                                onChange={handleChange}
                                value={activeInput === 'email' ? activeValue : email}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="pw1"
                            rules={[{required: true, message: 'Please input your password!'}]}
                        >
                            <Input.Password
                                onBlur={handleBlur(setPw1)}
                                onChange={handleChange}
                                value={activeInput === 'pw1' ? activeValue : pw1}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Repeat Password"
                            name="pw2"
                            rules={[{required: true, message: 'Please repeat your password!'}]}
                        >
                            <Input.Password
                                onBlur={handleBlur(setPw2)}
                                onChange={handleChange}
                                value={activeInput === 'pw2' ? activeValue : pw2}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                onClick={handleSubmit}
                                type="primary"
                                htmlType="submit"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
};

export default Register;