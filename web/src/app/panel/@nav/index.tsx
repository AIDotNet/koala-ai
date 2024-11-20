import UserAvatar from '@/features/User/UserAvatar';
import { ActionIcon, Logo, SideNav } from '@lobehub/ui';
import { Album, MessageSquare, Settings2 } from 'lucide-react';
import { memo, useState, } from 'react';



const Nav = memo(() => {
    const [tab, setTab] = useState<string>('chat');

    return (
        <SideNav
            style={{ height: '100%', zIndex: 100, }}
            avatar={<UserAvatar />}
            bottomActions={<ActionIcon icon={Settings2} />}
            topActions={
                <>
                    <ActionIcon
                        active={tab === 'chat'}
                        icon={MessageSquare}
                        onClick={() => setTab('chat')}
                        size="large"
                    />
                    <ActionIcon
                        active={tab === 'market'}
                        icon={Album}
                        onClick={() => setTab('market')}
                        size="large"
                    />
                </>
            }
        />
    )
})

Nav.displayName = "Nav";

export default Nav;