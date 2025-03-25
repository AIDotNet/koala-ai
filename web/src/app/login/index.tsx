import { memo, useEffect, useState } from 'react';
import { message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styled from 'styled-components';
import { token } from '@/services/AuthorizeService';
import { useNavigate } from 'react-router-dom';
import { loginCerificationCode } from '@/services/NotificationsService';

// 样式组件定义
const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const LoginCard = styled.div`
  width: 420px;
  padding: 40px 30px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
`;

const InputField = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
  outline: none;
  
  &:focus {
    border-color: #6e8efb;
    box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.2);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(InputField)`
  padding-right: 48px;
`;

const PasswordToggle = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  font-size: 18px;
  
  &:hover {
    color: #333;
  }
`;

const CaptchaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CaptchaInput = styled(InputField)`
  flex: 1;
`;

const CaptchaImage = styled.img`
  height: 48px;
  width: 120px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 48px;
  background: #4a6cf7;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #3b5de7;
    box-shadow: 0 4px 8px rgba(74, 108, 247, 0.2);
  }
  
  &:active {
    transform: translateY(2px);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const RegisterLink = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  
  span {
    color: #4a6cf7;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      color: #3b5de7;
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoginPage = memo(() => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        if (!user) {
            message.error('请输入账号');
            return;
        }
        if (!password) {
            message.error('请输入密码');
            return;
        }
        if (!captcha.value) {
            message.error('请输入验证码');
            return;
        }

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
            message.error('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoginContainer>
            <LoginCard>
                <Title>AIAgent 登录系统</Title>
                
                <InputGroup>
                    <Label>账号</Label>
                    <InputField
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="请输入账号"
                        autoComplete="username"
                    />
                </InputGroup>
                
                <InputGroup>
                    <Label>密码</Label>
                    <PasswordWrapper>
                        <PasswordInput
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            autoComplete="current-password"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleLogin();
                                }
                            }}
                        />
                        <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        </PasswordToggle>
                    </PasswordWrapper>
                </InputGroup>
                
                <InputGroup>
                    <Label>验证码</Label>
                    <CaptchaGroup>
                        <CaptchaInput
                            type="text"
                            value={captcha.value}
                            onChange={(e) => setCaptcha({
                                ...captcha,
                                value: e.target.value,
                            })}
                            placeholder="请输入验证码"
                        />
                        <CaptchaImage 
                            src={captcha.code} 
                            onClick={getCode} 
                            title="点击刷新验证码"
                            alt="验证码"
                        />
                    </CaptchaGroup>
                </InputGroup>
                
                <LoginButton
                    disabled={loading}
                    onClick={handleLogin}
                >
                    {loading ? (
                        <>
                            <LoadingSpinner />
                            登录中...
                        </>
                    ) : (
                        "登录"
                    )}
                </LoginButton>
                
                <RegisterLink>
                    <span onClick={() => {
                        if (typeof window === 'undefined') return;
                        window.location.href = '/register';
                    }}>
                        注册账号
                    </span>
                </RegisterLink>
            </LoginCard>
        </LoginContainer>
    );
});

export default LoginPage;