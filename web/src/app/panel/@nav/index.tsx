import UserAvatar from '@/features/User/UserAvatar';
import { useWorkspaceStore } from '@/store/workspace';
import { ActionIcon, SideNav, Tooltip } from '@lobehub/ui';
import { Divider } from 'antd';
import {
    Album,
    Box,
    Plus,
    Settings2
} from 'lucide-react';
import { memo, useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const Nav = memo(() => {
    const { setCreateWorkspaceModalOpen } = useWorkspaceStore();
    const [tab, setTab] = useState<string>('chat');
    const location = useLocation();
    const navigate = useNavigate();
    const [menus, setMenus] = useState([
        {
            key: 'agent',
            icon: Box,
            title: '智能体'
        }, {
            key: 'knowledge',
            icon: Album,
            title: '知识库'
        }
    ])

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('application')) {
            setTab('application');
        } else if (path.includes('knowledge')) {
            setTab('knowledge');
        } else {
            setTab('application');
        }
    }, [location.pathname])

    function handleTabChange(tab: string) {
        setTab(tab);
        navigate(`/panel/${tab}`);
    }

    function handleAddWorkspace() {
        setCreateWorkspaceModalOpen(true);
    }

    return (
        <SideNav
            style={{ height: '100%', zIndex: 100, }}
            avatar={<UserAvatar clickable />}
            bottomActions={<ActionIcon icon={Settings2} />}
            topActions={
                <>
                    <Tooltip title='新增工作区'>
                        <ActionIcon icon={Plus}
                            // @ts-ignore
                            onClick={handleAddWorkspace} />
                    </Tooltip>
                    <Divider variant='dashed' />
                    {menus.map(x => {
                        return (<>
                            <Tooltip title={x.title}>
                                <ActionIcon
                                    active={tab === x.key}
                                    icon={x.icon}
                                    // @ts-ignore
                                    onClick={() => handleTabChange(x.key)}
                                    size="large"
                                />
                            </Tooltip>
                        </>)
                    })}
                </>
            }
        />
    )
})

Nav.displayName = "Nav";

export default Nav;