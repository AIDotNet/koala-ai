import { memo } from "react";
import { ILayout } from "../../../types/layout";
import { Layout } from "@lobehub/ui";
import TopLayout from "./top";
import Bottom from "./Bottom";


const WelcomeLayout = memo<ILayout>(({ children }) => {
    return (
        <Layout
            footer={<Bottom />}
            header={<TopLayout />}
        >
            {children}
        </Layout>
    );
});

WelcomeLayout.displayName = "WelcomeLayout";

export default WelcomeLayout;