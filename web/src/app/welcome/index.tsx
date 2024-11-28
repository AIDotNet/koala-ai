import { memo, useState } from "react";
import WelcomeLayout from "./_layout";
import { Button } from 'antd';


const Welcome = memo(() => {

    return (
        <WelcomeLayout>
            首页
        </WelcomeLayout>
    );
});

Welcome.displayName = "Welcome";

export default Welcome;