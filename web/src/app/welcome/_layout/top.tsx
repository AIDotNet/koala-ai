import { memo, useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useGlobalStore } from '../../../store/global';
import { SidebarTabKey } from '../../../store/global/initialState';

// 定义导航选项卡类型
interface TabItem {
  key: SidebarTabKey;
  label: string;
  to: string;
}

const HeaderContainer = styled.header<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: ${props => props.isDarkMode ? '#141414' : '#fff'};
  box-shadow: ${props => props.isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.06)'};
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const LogoText = styled(motion.span)`
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(to right, #1677ff, #4096ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavContainer = styled.nav`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const TabsList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
`;

const TabItem = styled.li<{ active: boolean; isDarkMode: boolean }>`
  position: relative;
  padding: 0 8px;
  cursor: pointer;
  font-size: 15px;
  color: ${props => {
    if (props.active) return '#1677ff';
    return props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)';
  }};
  font-weight: ${props => props.active ? '500' : 'normal'};
  transition: color 0.3s ease;
  
  &:hover {
    color: #1677ff;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -22px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #1677ff;
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LoginButton = styled(Button)`
  border-radius: 4px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.2);
  }
  
  transition: all 0.3s ease;
`;

const TopLayout = memo(() => {
    const [
        sidebarKey,
        switchSidebar,
        theme
    ] = useGlobalStore((s) => [s.sidebarKey, s.switchSidebar, s.theme]);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const tabs: TabItem[] = [
        {
            key: SidebarTabKey.Welcome,
            label: "首页",
            to: "/"
        },
        {
            key: SidebarTabKey.Docs,
            label: "文档",
            to: "/docs"
        },
        {
            key: SidebarTabKey.About,
            label: "关于",
            to: "/about"
        }
    ];

    // 根据当前路径设置活动标签
    useEffect(() => {
        const currentPath = location.pathname;
        const currentTab = tabs.find(tab => {
            if (tab.to === '/') {
                return currentPath === '/';
            }
            return currentPath.startsWith(tab.to);
        });
        
        if (currentTab && currentTab.key !== sidebarKey) {
            switchSidebar(currentTab.key);
        }
    }, [location.pathname, sidebarKey, switchSidebar, tabs]);

    useEffect(() => {
        // 根据主题设置暗黑模式
        if (theme === 'dark') {
            setIsDarkMode(true);
        } else if (theme === 'light') {
            setIsDarkMode(false);
        } else if (theme === 'auto') {
            // 检测系统主题
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
            
            // 监听系统主题变化
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
                setIsDarkMode(e.matches);
            };
            
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    const handleTabClick = (tab: TabItem) => {
        switchSidebar(tab.key);
        navigate(tab.to);
    };

    return (
        <HeaderContainer isDarkMode={isDarkMode}>
            <LogoContainer
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <LogoText
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Koala
                </LogoText>
            </LogoContainer>
            
            <NavContainer>
                <TabsList>
                    {tabs.map((tab) => (
                        <TabItem 
                            key={tab.key}
                            active={sidebarKey === tab.key}
                            isDarkMode={isDarkMode}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab.label}
                        </TabItem>
                    ))}
                </TabsList>
            </NavContainer>
            
            <ActionsContainer>
                <LoginButton 
                    type="primary"
                    onClick={() => navigate('/login')}
                >
                    登录
                </LoginButton>
            </ActionsContainer>
        </HeaderContainer>
    );
});

TopLayout.displayName = "TopLayout";

export default TopLayout;