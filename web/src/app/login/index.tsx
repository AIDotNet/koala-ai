import { memo, useEffect, useState } from 'react';
import { message, Tabs, Checkbox, Input, Button, Form, Space, theme as antdTheme } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { token } from '@/services/AuthorizeService';
import { useNavigate } from 'react-router-dom';
import { loginCerificationCode } from '@/services/NotificationsService';
import { createStyles } from 'antd-style';

const { useToken } = antdTheme;

// 使用antd-style创建样式
const useStyles = createStyles(({ token, css }) => ({
  loginContainer: css`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${token.colorBgLayout};
    font-family: ${token.fontFamily};
  `,
  loginCard: css`
    width: 400px;
    background-color: ${token.colorBgContainer};
    padding: 40px 30px;
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  `,
  logo: css`
    text-align: center;
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
    color: ${token.colorPrimary};
  `,
  title: css`
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 28px;
    color: ${token.colorTextHeading};
  `,
  inputGroup: css`
    margin-bottom: 24px;
  `,
  captchaWrapper: css`
    display: flex;
    gap: 8px;
    
    .ant-input-affix-wrapper {
      flex: 1;
    }
  `,
  captchaImage: css`
    height: 45px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    cursor: pointer;
  `,
  rememberRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  `,
  loginButton: css`
    height: 40px;
    width: 100%;
  `,
  footer: css`
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: ${token.colorTextSecondary};
    
    a {
      color: ${token.colorPrimary};
      
      &:hover {
        color: ${token.colorPrimaryHover};
      }
    }
  `,
  formItemNoMargin: css`
    margin-bottom: 0;
  `,
  loadingIcon: css`
    margin-right: 8px;
  `
}));

const LoginPage = memo(() => {
    const { styles } = useStyles();
    const { token: themeToken } = useToken();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [activeTab, setActiveTab] = useState('account');
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
                form.setFieldValue('captcha', '');
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
            const values = await form.validateFields();
            
            if (!values.username) {
                message.error('请输入账号');
                return;
            }
            if (!values.password) {
                message.error('请输入密码');
                return;
            }
            if (!captcha.value) {
                message.error('请输入验证码');
                return;
            }

            const res = await token({
                username: values.username,
                password: values.password,
                captcha: captcha.value,
                captchaKey: captcha.key,
            });
            
            if (res.success) {
                localStorage.setItem('token', res.data);
                if (rememberMe) {
                    localStorage.setItem('username', values.username);
                }
                message.success('登录成功');
                navigate('/panel');
            } else {
                message.error(res.message);
                getCode();
            }
        } catch (e) {
            console.error(e);
            message.error('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.logo}>Koala AI</div>
                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    centered
                    items={[
                        {
                            key: 'account',
                            label: '账号密码登录',
                            children: (
                                <Form
                                    form={form}
                                    name="login"
                                    onFinish={handleLogin}
                                    autoComplete="off"
                                    layout="vertical"
                                    requiredMark={false}
                                >
                                    <Form.Item
                                        name="username"
                                        className={styles.inputGroup}
                                        rules={[{ required: true, message: '请输入账号' }]}
                                    >
                                        <Input 
                                            prefix={<UserOutlined style={{ color: themeToken.colorTextTertiary }} />} 
                                            placeholder="请输入账号" 
                                            autoComplete="username"
                                            size="large"
                                        />
                                    </Form.Item>
                                    
                                    <Form.Item
                                        name="password"
                                        className={styles.inputGroup}
                                        rules={[{ required: true, message: '请输入密码' }]}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined style={{ color: themeToken.colorTextTertiary }} />} 
                                            placeholder="请输入密码" 
                                            autoComplete="current-password"
                                            size="large"
                                            onPressEnter={handleLogin}
                                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        />
                                    </Form.Item>
                                    
                                    <Form.Item className={styles.inputGroup}>
                                        <Space.Compact className={styles.captchaWrapper}>
                                            <Form.Item 
                                                name="captcha" 
                                                className={styles.formItemNoMargin}
                                                rules={[{ required: true, message: '请输入验证码' }]}
                                            >
                                                <Input 
                                                    prefix={<SafetyCertificateOutlined style={{ color: themeToken.colorTextTertiary }} />} 
                                                    placeholder="请输入验证码" 
                                                    size="large"
                                                    onChange={(e) => setCaptcha({
                                                        ...captcha,
                                                        value: e.target.value,
                                                    })}
                                                />
                                            </Form.Item>
                                            <img 
                                                className={styles.captchaImage}
                                                src={captcha.code} 
                                                onClick={getCode} 
                                                title="点击刷新验证码"
                                                alt="验证码"
                                            />
                                        </Space.Compact>
                                    </Form.Item>
                                    
                                    <Form.Item className={styles.rememberRow}>
                                        <Checkbox 
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        >
                                            记住我
                                        </Checkbox>
                                        <a onClick={() => message.info('请联系管理员重置密码')}>
                                            忘记密码
                                        </a>
                                    </Form.Item>
                                    
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className={styles.loginButton}
                                            size="large"
                                            loading={loading}
                                            block
                                        >
                                            登录
                                        </Button>
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'mobile',
                            label: '手机号登录',
                            children: (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: themeToken.colorTextSecondary }}>
                                    暂未开放手机号登录功能
                                </div>
                            ),
                        },
                    ]}
                />
                
                <div className={styles.footer}>
                    还没有账号? <a onClick={() => {
                        if (typeof window === 'undefined') return;
                        window.location.href = '/register';
                    }}>立即注册</a>
                </div>
            </div>
        </div>
    );
});

export default LoginPage;