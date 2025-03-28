import UserAvatar from '@/features/User/UserAvatar';
import { useWorkspaceStore } from '@/store/workspace';
import { Tooltip, Dropdown } from 'antd';
import { Flexbox } from 'react-layout-kit';
import {
    Album,
    Box,
    Plus,
    Settings2,
    GitBranch,
    Brain
} from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActionIcon } from '@lobehub/ui';

const Nav = memo(() => {
    const { setCreateWorkspaceModalOpen } = useWorkspaceStore();
    const [tab, setTab] = useState<string>('agent');
    const location = useLocation();
    const navigate = useNavigate();
    
    const menus = [
        {
            key: 'agent',
            icon: Box,
            title: '智能体'
        }, 
        {
            key: 'knowledge',
            icon: Album,
            title: '知识库'
        },
        {
            key: 'workflow',
            icon: GitBranch,
            title: '工作流'
        }
    ];

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('application')) {
            setTab('application');
        } else if (path.includes('knowledge')) {
            setTab('knowledge');
        } else if (path.includes('workflow')) {
            setTab('workflow');
        } else {
            setTab('application');
        }
    }, [location.pathname]);

    const handleTabChange = (tab: string) => {
        setTab(tab);
        navigate(`/panel/${tab}`);
    };

    const handleAddWorkspace = () => {
        setCreateWorkspaceModalOpen(true);
    };

    const settingsMenuItems = [
        {
            key: 'model',
            icon: <Brain size={16} />,
            label: '模型配置管理',
            onClick: () => navigate('/panel/model')
        }
    ];

    return (
        <Flexbox 
            style={{
                width: '64px',
                height: '100vh',
                background: '#1a1a1a',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                zIndex: 100,
            }}
        >
            <Flexbox
                padding={12}
                gap={24}
            >
                <UserAvatar clickable />
                <Tooltip title="新增工作区" placement="right">
                    <ActionIcon
                        icon={Plus}
                        onClick={handleAddWorkspace}
                        style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                        }}
                    />
                </Tooltip>
                <div 
                    style={{
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        margin: '4px 0',
                    }}
                />
            </Flexbox>

            {/* 导航菜单 */}
            <Flexbox
                gap={8}
                style={{
                    padding: '0 12px',
                }}
            >
                {menus.map(item => (
                    <Tooltip key={item.key} title={item.title} placement="right">
                        <ActionIcon
                            icon={item.icon}
                            onClick={() => handleTabChange(item.key)}
                            style={{
                                color: tab === item.key ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                background: tab === item.key ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                borderRadius: '8px',
                                transition: 'all 0.3s',
                            }}
                        />
                    </Tooltip>
                ))}
            </Flexbox>

            {/* 底部设置按钮 */}
            <Flexbox
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    padding: '12px',
                }}
            >
                <Dropdown
                    menu={{ items: settingsMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Tooltip title="设置" placement="right">
                        <ActionIcon
                            icon={Settings2}
                            style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                background: 'transparent',
                                borderRadius: '8px',
                            }}
                        />
                    </Tooltip>
                </Dropdown>
            </Flexbox>
        </Flexbox>
    );
});

Nav.displayName = "Nav";

export default Nav;