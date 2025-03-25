import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { GITEE, GITHUB } from "@/const/url";
import { useGlobalStore } from "@/store/global";

interface FooterItem {
  title: string;
  url: string;
  description: string;
}

interface FooterColumn {
  title: string;
  items: FooterItem[];
}

const FooterContainer = styled.footer<{ isDarkMode: boolean }>`
  background-color: ${props => props.isDarkMode ? '#141414' : '#f5f5f5'};
  padding: 48px 24px 24px;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 48px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 200px;
`;

const ColumnTitle = styled.h3<{ isDarkMode: boolean }>`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'};
  transition: color 0.3s ease;
`;

const ItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  margin-bottom: 12px;
`;

const ItemLink = styled.a<{ isDarkMode: boolean }>`
  text-decoration: none;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'};
  display: block;
  transition: color 0.3s ease;
  
  &:hover {
    color: #1677ff;
  }
`;

const ItemTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDescription = styled.div<{ isDarkMode: boolean }>`
  font-size: 12px;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
  transition: color 0.3s ease;
`;

const BottomSection = styled.div<{ isDarkMode: boolean }>`
  margin-top: 48px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
  font-size: 14px;
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)'};
  transition: color 0.3s ease, border-color 0.3s ease;
`;

const Bottom = memo(() => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [theme] = useGlobalStore((s) => [s.theme]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  
  const columns: FooterColumn[] = [
    {
      title: "关于",
      items: [
        {
          title: "关于我们",
          description: "关于我们的故事",
          url: "/about"
        },
        {
          title: "联系我们",
          url: "/contact",
          description: "商务合作"
        }
      ]
    },
    {
      title: "帮助",
      items: [
        {
          title: "常见问题",
          url: "/faq",
          description: "常见问题解答"
        },
        {
          title: "服务条款",
          url: "/terms",
          description: "服务条款和隐私政策"
        }
      ]
    },
    {
      title: "社区",
      items: [
        {
          title: "GitHub",
          url: GITHUB,
          description: "GitHub 仓库"
        },
        {
          title: "Gitee",
          url: GITEE,
          description: "Gitee 仓库"
        }
      ]
    }
  ];

  const handleInternalLink = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url.startsWith('/')) {
      e.preventDefault();
      navigate(url);
    }
  };

  return (
    <FooterContainer isDarkMode={isDarkMode}>
      <FooterContent>
        {columns.map((column, index) => (
          <Column key={index}>
            <ColumnTitle isDarkMode={isDarkMode}>{column.title}</ColumnTitle>
            <ItemsList>
              {column.items.map((item, itemIndex) => (
                <Item key={itemIndex}>
                  <ItemLink 
                    href={item.url}
                    target={item.url.startsWith('/') ? undefined : '_blank'}
                    rel={item.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                    onClick={(e) => handleInternalLink(e, item.url)}
                    isDarkMode={isDarkMode}
                  >
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemDescription isDarkMode={isDarkMode}>{item.description}</ItemDescription>
                  </ItemLink>
                </Item>
              ))}
            </ItemsList>
          </Column>
        ))}
      </FooterContent>
      <BottomSection isDarkMode={isDarkMode}>
        <div>© {currentYear} Koala. All rights reserved.</div>
      </BottomSection>
    </FooterContainer>
  );
});

Bottom.displayName = "Bottom";

export default Bottom;