import Workspace from "@/features/Workspace";
import { useWorkspaceStore } from "@/store/workspace";
import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Button, Empty, Spin } from "antd";
import styled from "styled-components";
import { SpotlightCard } from '@lobehub/ui/awesome';
import { useAgentStore } from "@/store/agent";
import { CreateAgentPage } from "./features/CreateAgent";
import { Avatar } from "@lobehub/ui";
import {useNavigate} from 'react-router-dom'

const StyledEmpty = styled(Empty)`
    margin: 20px;
    color: #888;
    .ant-empty-image {
        margin-bottom: 16px;
    }
`;

const StyledContainer = styled(Flexbox)`
    width: 100%;
`;

const Agent = memo(() => {
    const [activeWorkspaceId] = useWorkspaceStore(state => [state.activeWorkspaceId]);
    const navigate = useNavigate();
    const { agent, total, inputAgent, loadAgent } = useAgentStore(state => ({
        // 应用列表
        agent: state.agent,
        // 应用总数
        total: state.total,
        // 应用搜索条件
        inputAgent: state.inputAgent,
        // 加载应用列表
        loadAgent: state.loadAgent,
    }));

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeWorkspaceId) {
            setLoading(true);
            loadAgent(activeWorkspaceId).finally(() => {
                setLoading(false);
            });
        }
    }, [activeWorkspaceId]);

    function renderItem(item: any) {
        return (<Flexbox 
            onClick={()=>{
                navigate('/panel/agent/info/'+item.id);
            }}
            align={'flex-start'} gap={8} horizontal style={{ padding: 16 }}>
            <Avatar size={24} avatar={item.avatar} style={{ flex: 'none' }} />
            <Flexbox>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</div>
                <div style={{ opacity: 0.6 }}>{item.introduction}</div>
            </Flexbox>
        </Flexbox>)
    }

    return <Flexbox horizontal style={{ width: '100%' }}>
        <Workspace />
        <Flexbox style={{
            flex: 1,
        }}>
            <Flexbox style={{
                padding: 20,
                width: '100%',
                display: 'flex',
                flexDirection: 'row-reverse',
            }}>
                <CreateAgentPage />
            </Flexbox>
            <StyledContainer horizontal>
                {
                    activeWorkspaceId ? (
                        loading ? (
                            <div style={{
                                textAlign: 'center',
                                width:"100%"
                            }}>
                                <Spin />
                            </div>
                        ) : (
                            agent?.length === 0 ? (
                                <StyledEmpty description="暂无数据" />
                            ) : (
                                <SpotlightCard
                                    items={agent}
                                    renderItem={renderItem}
                                    style={{ margin: '10px' }}
                                />
                            )
                        )
                    ) : (
                        <StyledEmpty description="请先选择工作空间" />
                    )
                }
            </StyledContainer>
        </Flexbox>
    </Flexbox>
})

export default Agent;