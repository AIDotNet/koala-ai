import { memo } from "react";
import { ILayout } from "../types/layout";
import ThemeLayout from "./ThemeLayout";

const GlobalLayout = memo<ILayout>(({ children }) => {
    return (
        <ThemeLayout>
            {children}
        </ThemeLayout>
    );
});

export default GlobalLayout;