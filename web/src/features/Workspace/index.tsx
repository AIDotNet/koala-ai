import { useWorkspaceStore } from '@/store/workspace';
import { DraggablePanel, ActionIcon, Avatar, List } from '@lobehub/ui';
import { useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useGlobalStore } from '@/store/global';
import { MoreHorizontalIcon } from 'lucide-react';
import {
    useNavigate,
    useSearchParams
} from 'react-router-dom';
import './index.css';
const {
    Item
} = List;

export default function Workspace() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [workspaces, loadWorkspaces, activeWorkspaceId, setActiveWorkspaceId] =
        useWorkspaceStore((state) => [state.workspaces, state.loadWorkspaces, state.activeWorkspaceId, state.setActiveWorkspaceId])
    const [workspaceSideExpansion, switchWorkspaceSideExpansion] =
        useGlobalStore((state) => [state.workspaceSideExpansion, state.switchWorkspaceSideExpansion])

    useEffect(() => {
        loadWorkspaces();
    }, [])

    useEffect(() => {
        if (activeWorkspaceId) {
            navigate(`?workspaceId=${activeWorkspaceId}`, {
                replace: true,
            });
        }
    }, [activeWorkspaceId])

    useEffect(() => {
        const workspaceId = searchParams.get('workspaceId');
        if (workspaceId) {
            setActiveWorkspaceId(parseInt(workspaceId));
        }
    }, [searchParams])

    return <DraggablePanel
        expand={workspaceSideExpansion}
        onExpandChange={() => {
            switchWorkspaceSideExpansion();
        }}
        placement='left' >
        <Flexbox 
            className='workspace'
            style={{
            height: '100%',
            padding: 10,
        }}>
            <span style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 10,
            }}>
                工作空间列表
            </span>
            {
                workspaces.map((workspace, index) => {
                    return <Item
                        className='workspace-item'
                        active={workspace.id === activeWorkspaceId}
                        key={index}
                        actions={ <ActionIcon style={{
                            cursor: 'pointer',
                            borderRadius: 8,
                            marginBottom: 5,
                            left: 20,
                        }} icon={MoreHorizontalIcon} />}
                        style={{
                            cursor: 'pointer',
                            top: 20,
                        }}
                        showAction={true}
                        onClick={() => {
                            setActiveWorkspaceId(workspace.id);
                        }}
                        description={workspace.description}
                        date={workspace.date}
                        title={workspace.name}
                        avatar={<Avatar avatar="🤖" />}
                        />
                })
            }
        </Flexbox>
    </DraggablePanel>
}
