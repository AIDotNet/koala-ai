import { ActionIcon, Logo, SideNav } from '@lobehub/ui';
import { Album, MessageSquare, Settings2 } from 'lucide-react';
import { memo, useState, } from 'react';



const Nav = memo(() => {
    const [tab, setTab] = useState<string>('chat');

    return (
        <SideNav
            style={{
                height: '100vh',
                width: 60,
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
            }}
            avatar={<Logo size={40} />}
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