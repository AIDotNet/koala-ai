import { Flexbox } from 'react-layout-kit';
import { memo } from "react";
import { Header, Logo, TabsNav } from '@lobehub/ui';
import { useGlobalStore } from '../../../store/global';
import { SidebarTabKey } from '../../../store/global/initialState';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const TopLayout = memo(() => {
    const [
        sidebarKey,
        switchSidebar
    ] = useGlobalStore((s) => [s.sidebarKey, s.switchSidebar]);
    const navigate = useNavigate();

    const tabs = [
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
    ]

    return (
        <Header
            logo={<Logo
                extra={<>
                    Koala AI
                </>}
            />}
            actions={<Flexbox>
                <Button onClick={() => {
                    navigate('/login')
                }}>
                    登录
                </Button>
            </Flexbox>}
            nav={
                <TabsNav
                    activeKey={sidebarKey || SidebarTabKey.Welcome}
                    onChange={(key) => {
                        switchSidebar(key as SidebarTabKey || SidebarTabKey.Welcome);
                        navigate(tabs.find((t) => t.key === key)?.to || "/");
                    }}
                    items={tabs} />
            }
        />
    );
});

TopLayout.displayName = "TopLayout";

export default TopLayout;