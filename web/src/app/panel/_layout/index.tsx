import { memo, useEffect } from "react";
import { Flexbox } from 'react-layout-kit';
import Nav from "../@nav";
import { useUserStore } from "@/store/user";
import { Outlet } from "react-router-dom";
import CreateWorkspace from "@/hooks/workspace/CreateWorkspace";

const PanelLayout = memo(() => {
    const [initUser] = useUserStore((s) => [s.initUser]);

    useEffect(() => {
        initUser();
    }, []);

    return (
        <Flexbox
            horizontal
            style={{
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Nav />
            <Flexbox 
                flex={1}
                style={{
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Outlet />
            </Flexbox>
            <CreateWorkspace />
        </Flexbox>
    );
});

export default PanelLayout;