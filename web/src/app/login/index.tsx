import { memo, useEffect, useState } from 'react';
import { message, Input, Button, Image } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, } from '@ant-design/icons';
import { GridShowcase, Tooltip } from '@lobehub/ui';
import styled from 'styled-components';
import { token } from '@/services/AuthorizeService';
import { useNavigate } from 'react-router-dom';
import { loginCerificationCode } from '@/services/NotificationsService';
const FunctionTools = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 0 auto;
    width: 380px;
    margin-top: 20px;
    color: #0366d6;
`;

const LoginPage = memo(() => {
    const navigate = useNavigate();
    const [id, setId] = useState('');

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState({
        key: '',
        value: '',
        code: '',
    });

    async function getCode() {
        loginCerificationCode()
            .then((res) => {
                setCaptcha({
                    key: res.data.key,
                    value: '',
                    code: res.data.code,
                });
            })
            .catch((e) => {
                message.error('获取验证码失败');
            });
    }

    useEffect(() => {
        getCode();
    }, []);

    async function handleLogin() {

        try {
            setLoading(true);
            const res = await token({
                username: user,
                password,
                captcha: captcha.value,
                captchaKey: captcha.key,
            });
            if (res.success) {
                localStorage.setItem('token', res.data);
                message.success('登录成功');
                navigate('/panel');
            } else {
                message.error(res.message);
            }

        } catch (e) {

        }
        setLoading(false);
    }

    return (
        <GridShowcase>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 auto',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                textAlign: 'center',

            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', width: '380px', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            display: 'block',

                        }}>
                            AIAgent 登录系统
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px', width: '100%' }}>
                        <Input
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            size='large'
                            placeholder="请输入账号" />
                    </div>
                    <div style={{ width: '100%' }}></div>
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size='large'
                        placeholder="请输入密码"
                        onPressEnter={async () => {
                            await handleLogin();
                        }}
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <div style={{ marginBottom: '20px', width: '100%' }}></div>
                    <Input
                        value={captcha.value}
                        onChange={(e) => setCaptcha({
                            ...captcha,
                            value: e.target.value,
                        })}
                        size='large'
                        placeholder="请输入验证码"
                        addonAfter={<Tooltip title="点击刷新验证码">
                            <Image 
                            preview={false}
                            style={{
                                width: '100px',
                            }} src={captcha.code} onClick={getCode} />
                        </Tooltip>}
                    />
                </div>
                <div style={{
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '380px',
                    marginTop: '20px',
                }}>
                    <Button
                        loading={loading}
                        onClick={async () => {
                            await handleLogin();
                        }}
                        size='large'
                        type="primary"
                        block >
                        登录
                    </Button>
                </div>
                <FunctionTools>
                    <span onClick={() => {
                        if (typeof window === 'undefined') return;
                        window.location.href = '/register';
                    }}>
                        注册账号
                    </span>
                </FunctionTools>
            </div>
        </GridShowcase>
    );
});

export default LoginPage;