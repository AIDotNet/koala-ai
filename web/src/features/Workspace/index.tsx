import { useWorkspaceStore } from '@/store/workspace';
import { DraggablePanel, ActionIcon, Avatar, List, EditableText, Input } from '@lobehub/ui';
import { useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useGlobalStore } from '@/store/global';
import { MoreHorizontalIcon } from 'lucide-react';
import { Dropdown } from "antd";
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
    const [workspaces, loadWorkspaces, activeWorkspaceId, setActiveWorkspaceId, setWorkspaceName, setWorkspaceEditable, deleteWorkspace] =
        useWorkspaceStore((state) => [state.workspaces, state.loadWorkspaces, state.activeWorkspaceId, state.setActiveWorkspaceId, state.setWorkspaceName, state.setWorkspaceEditable, state.deleteWorkspace])
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
        if (workspaces?.length === 0) {
            // navigate('/login');
        }else{
            setActiveWorkspaceId(workspaces[0].id);
        }
    }, [workspaces])

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
                        actions={<>
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                    items: [{
                                        label: '查看成员',
                                        key: 'view',
                                        onClick: () => {
                                            
                                        }
                                    }, {
                                        label: '编辑',
                                        key: 'edit',
                                        onClick: () => {
                                            setWorkspaceEditable(workspace.id, true);
                                        }
                                    }, {
                                        label: '删除',
                                        key: 'delete',
                                        danger: true,
                                        onClick: () => {
                                            deleteWorkspace(workspace.id);
                                        }
                                    }]
                                }}>
                                <ActionIcon style={{
                                    cursor: 'pointer',
                                    borderRadius: 8,
                                    marginBottom: 5,
                                    left: 20,
                                }} icon={MoreHorizontalIcon} />
                            </Dropdown>
                        </>}
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
                        title={
                            workspace.editable ? <Input
                                type='pure'
                                value={workspace.name}
                                autoFocus
                                maxLength={10}
                                showCount
                                onBlur={() => {
                                    setWorkspaceName(workspace.id, workspace.name, true);
                                }}
                                onChange={(v) => {
                                    setWorkspaceName(workspace.id, v.target.value);
                                }}
                            /> : workspace.name
                        }
                        avatar={<></>}
                    />
                })
            }
        </Flexbox>
    </DraggablePanel>
}
