import { ILayout } from "@/types/layout";
import { memo } from "react";


const Layout = memo<ILayout>(({ children }) => {
    return (
        <div>
            {children}
        </div>
    );
}
);

Layout.displayName = "DesktopLayout";

export default Layout;