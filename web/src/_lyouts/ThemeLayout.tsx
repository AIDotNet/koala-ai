import { memo, useEffect } from "react";
import { ILayout } from "../types/layout";
import { useGlobalStore } from "../store/global";
import { ThemeProvider } from "@lobehub/ui";

const ThemeLayout = memo<ILayout>(({ children }) => {
    const [
        theme,
        switchTheme
    ] = useGlobalStore((s) => [s.theme, s.switchTheme])

    useEffect(() => {
        // 获取系统主题
        const getSystemTheme = () => {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };

        // 设置主题
        const setTheme = (themeValue: string) => {
            if (themeValue === 'auto') {
                document.documentElement.setAttribute('data-theme', getSystemTheme());
            } else {
                document.documentElement.setAttribute('data-theme', themeValue);
            }
        };

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            if (theme === 'auto') {
                setTheme('auto');
            }
        };

        // 初始设置主题
        setTheme(theme);

        // 添加系统主题变化监听
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        // 清理函数
        return () => {
            document.documentElement.removeAttribute('data-theme');
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme]);

    return (
        <ThemeProvider
            style={{
                height: '100vh',
                width: '100%',
            }}
            themeMode={theme}
            onThemeModeChange={switchTheme}
        >
            {children}
        </ThemeProvider>
    );
});

export default ThemeLayout;