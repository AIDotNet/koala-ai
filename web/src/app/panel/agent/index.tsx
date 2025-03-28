import Workspace from "@/features/Workspace";
import { useWorkspaceStore } from "@/store/workspace";
import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Button, Empty, Spin, Typography, Card, Badge, Tag, Space, Dropdown } from "antd";
import styled from "styled-components";
import { useAgentStore } from "@/store/agent";
import { CreateAgentPage } from "./features/CreateAgent";
import { Avatar } from "@lobehub/ui";
import { useNavigate } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StyledEmpty = styled(Empty)`
    margin: 20px;
    color: #888;
    .ant-empty-image {
        margin-bottom: 16px;
    }
`;

const StyledContainer = styled(Flexbox)`
    width: 100%;
    padding: 0 16px;
`;

const AgentItem = styled(Card)`
    margin-bottom: 16px;
    border-radius: 12px;
    transition: all 0.3s;
    cursor: pointer;
    border: 1px solid #f0f0f0;
    overflow: hidden;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
    }
`;

const AgentTag = styled(Tag)`
    margin-right: 0;
    font-size: 12px;
    border-radius: 4px;
`;

const MetaItem = styled(Flexbox)`
    padding: 6px 12px;
    background-color: #f9f9f9;
    border-radius: 6px;
    align-items: center;
`;

const PageHeader = styled(Flexbox)`
    padding: 24px 16px 16px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
    opacity: 0.7;
    &:hover {
        opacity: 1;
    }
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
        return (
            <AgentItem 
                bodyStyle={{ padding: '16px' }}
                hoverable
                extra={
                    <Dropdown 
                        menu={{ 
                            items: [
                                {
                                    key: 'view',
                                    label: '查看详情',
                                    onClick: (e) => {
                                        e.domEvent.stopPropagation();
                                        navigate('/panel/agent/info/' + item.id);
                                    }
                                }
                            ]
                        }}
                        trigger={['click']}
                    >
                        <ActionButton 
                            type="text" 
                            icon={<MoreOutlined />} 
                            size="small" 
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Dropdown>
                }
                onClick={() => {
                    navigate('/panel/agent/info/' + item.id);
                }}
            >
                <Flexbox gap={16} horizontal align="flex-start" style={{ position: 'relative' }}>
                    <Badge 
                        status="processing" 
                        style={{ position: 'absolute', top: 0, right: 0 }} 
                    />
                    
                    <Avatar 
                        size={48} 
                        avatar={item.avatar} 
                        style={{ 
                            flex: 'none',
                            backgroundColor: '#f6f6f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px'
                        }} 
                    />
                    
                    <Flexbox gap={12} style={{ flex: 1 }}>
                        <Flexbox horizontal justify="space-between" align="center">
                            <Flexbox horizontal gap={12} align="center">
                                <Text strong style={{ fontSize: 16 }}>{item.name}</Text>
                                <AgentTag color="green">智能应用</AgentTag>
                            </Flexbox>
                        </Flexbox>
                        
                        <Text type="secondary" style={{ marginBottom: 12 }}>
                            {item.introduction || "无描述信息"}
                        </Text>
                        
                        <Flexbox horizontal gap={8}>
                            {item.model && (
                                <MetaItem horizontal gap={4}>
                                    <span style={{ fontSize: 14 }}>🤖</span>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {item.model || "默认模型"}
                                    </Text>
                                </MetaItem>
                            )}
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </AgentItem>
        );
    }

    return (
        <Flexbox horizontal style={{ width: '100%' }}>
            <Workspace />
            <Flexbox style={{ flex: 1 }}>
                <PageHeader horizontal justify="space-between" align="center">
                    <Title level={4} style={{ margin: 0 }}>应用管理</Title>
                    <CreateAgentPage />
                </PageHeader>
                
                <StyledContainer>
                    {
                        activeWorkspaceId ? (
                            loading ? (
                                <div style={{ textAlign: 'center', width: "100%", padding: "40px 0" }}>
                                    <Spin size="large" tip="加载应用..." />
                                </div>
                            ) : (
                                agent?.length === 0 ? (
                                    <StyledEmpty description="暂无应用数据" style={{ margin: "40px 0" }} />
                                ) : (
                                    <Flexbox gap={0}>
                                        {agent.map((item) => renderItem(item))}
                                    </Flexbox>
                                )
                            )
                        ) : (
                            <StyledEmpty description="请先选择工作空间" style={{ margin: "40px 0" }} />
                        )
                    }
                </StyledContainer>
            </Flexbox>
        </Flexbox>
    );
});

Agent.displayName = 'Agent';

export default Agent;