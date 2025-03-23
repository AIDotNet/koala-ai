import { memo, useEffect } from "react";
import { Flexbox } from 'react-layout-kit';
import Nav from "../@nav";
import { useUserStore } from "@/store/user";
import { Outlet } from "react-router-dom";
import CreateWorkspace from "@/hooks/workspace/CreateWorkspace";

const PanelLayout = memo(({ }) => {
    const [initUser] = useUserStore((s) => [s.initUser]);

    useEffect(() => {
        initUser();
    }, [])

    return (
        <Flexbox
            height={'100%'}
            horizontal
            style={{
                position: 'relative',
            }}
            width={'100%'}
        >
            <Nav />
            <Flexbox style={{
                flex: 1,
                height: '100vh',
                overflow: 'auto'
            }}>

                <Outlet />
            </Flexbox>
            <CreateWorkspace />
        </Flexbox>)
})

export default PanelLayout;