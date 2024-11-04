import { memo } from "react";
import { ILayout } from "../types/layout";
import { useGlobalStore } from "../store/global";
import { ThemeProvider } from "@lobehub/ui";

const ThemeLayout = memo<ILayout>(({ children }) => {
    const [
        theme,
        switchTheme
    ] = useGlobalStore((s) => [s.theme, s.switchTheme])

    return (
        <ThemeProvider
            themeMode={theme}
            onThemeModeChange={switchTheme}
        >
            {children}
        </ThemeProvider>
    );
});

export default ThemeLayout;