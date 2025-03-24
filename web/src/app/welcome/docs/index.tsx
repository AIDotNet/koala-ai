import { memo, useEffect, useState } from "react";
import WelcomeLayout from "../_layout";
import { Flexbox } from 'react-layout-kit';
import { DraggablePanel, Markdown } from "@lobehub/ui";
import Menu from "@/components/Menu";
import Divider from "@lobehub/ui/es/Form/components/FormDivider";
import { useNavigate, useLocation } from "react-router-dom";


const Docs = memo(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const menu = new URLSearchParams(location.search).get('menu') || 'introduction';

    const [markdown, setMarkdown] = useState('');
    const [menuKey, setMenuKey] = useState(menu);
    const menus = [
        {
            label: 'Koala AI介绍',
            key: 'introduction',
        },
        {
            label: '快速开始',
            key: 'quick-start',
        },
        {
            label: '配置',
            key: 'config',
        },
        {
            label: '插件',
            key: 'plugin',
        },
        {
            label: 'API',
            key: 'api',
        },
        {
            label: '部署',
            key: 'deploy',
        },
        {
            label: '更新日志',
            key: 'changelog',
        }
    ]

    function switchMenu(key: string) {
        setMenuKey(key);
        const query = new URLSearchParams(location.search);
        query.set('menu', key);
        navigate(`?${query.toString()}`);
    }

    useEffect(() => {
        menuMarkdown();
    }, [menuKey]);

    async function menuMarkdown() {
        const content = await fetch('/docs/' + menuKey + '.md')
            .then(response => response.text())
            .then(text => text);

        setMarkdown(content);
    }

    return (
        <WelcomeLayout>
            <Flexbox>
                <Flexbox>
                    <span style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        padding: 16,
                    }}>
                        Koala AI 文档
                    </span>
                </Flexbox>
                <Divider style={{
                    margin: '0',
                    height: 1,
                }} />
                <Flexbox horizontal>
                    <DraggablePanel
                        placement='left'
                    >
                        <Flexbox style={{
                            padding: 16,
                        }}>
                            <Menu
                                selectedKeys={[menuKey]}
                                onClick={(v) => {
                                    switchMenu(v.key);
                                }}
                                items={menus} />
                        </Flexbox>
                    </DraggablePanel>
                    <Flexbox style={{
                        padding: 16,
                        flex: 1,
                        overflow: 'auto',
                    }}>
                        <Markdown>
                            {markdown}
                        </Markdown>
                    </Flexbox>
                </Flexbox>
            </Flexbox>
        </WelcomeLayout>
    );
})

Docs.displayName = "Docs";

export default Docs;