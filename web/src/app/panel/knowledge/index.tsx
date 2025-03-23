import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Button, Empty, Spin, Tag, Tooltip, Typography, Card, Badge, Dropdown, Space } from "antd";
import styled from "styled-components";
import { useWorkspaceStore } from "@/store/workspace";
import Workspace from "@/features/Workspace";
import { CreateKnowledgePage } from "./features/CreateKnowledge";
import { EditKnowledge } from "./features/EditKnowledge";
import { DeleteKnowledge } from "./features/DeleteKnowledge";
import { Avatar } from "@lobehub/ui";
import { useNavigate } from 'react-router-dom';
import { fetchKnowledges } from "@/services/KnowledgeService";
import { RightOutlined, MoreOutlined } from '@ant-design/icons';

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

const KnowledgeItem = styled(Card)`
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

const KnowledgeTag = styled(Tag)`
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

const Knowledge = memo(() => {
    const [activeWorkspaceId] = useWorkspaceStore(state => [state.activeWorkspaceId]);
    const navigate = useNavigate();
    const [knowledges, setKnowledges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeWorkspaceId) {
            setLoading(true);
            loadData()
        }
    }, [activeWorkspaceId]);

    const loadData = () => {
        if (activeWorkspaceId) {
            fetchKnowledges(activeWorkspaceId, 1, 10)
                .then((res: any) => {
                    setKnowledges(res.data.data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }

    function getModelDisplayName(model: string | undefined): string {
        if (!model) return '';
        // Shorten display names for common models
        if (model === 'text-embedding-ada-002') return 'Ada-002';
        if (model.startsWith('gpt-')) return model;
        return model;
    }

    function renderItem(item: any) {
        return (
            <KnowledgeItem 
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
                                        navigate('/panel/knowledge/info/' + item.id);
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
                    navigate('/panel/knowledge/info/' + item.id);
                }}
            >
                <Flexbox gap={16} horizontal align="flex-start" style={{ position: 'relative' }}>
                    <Badge 
                        status={item.ragType === 0 ? "success" : "processing"} 
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
                                <KnowledgeTag color="blue">{item.ragTypeName || "普通知识库"}</KnowledgeTag>
                            </Flexbox>
                            <Space 
                                onClick={(e) => e.stopPropagation()} 
                                style={{ marginRight: 8 }}
                            >
                                <EditKnowledge 
                                    id={item.id} 
                                    onSuccess={loadData} 
                                />
                                <DeleteKnowledge
                                    id={item.id}
                                    name={item.name}
                                    onSuccess={loadData}
                                />
                            </Space>
                        </Flexbox>
                        
                        <Text type="secondary" style={{ marginBottom: 12 }}>
                            {item.description || "无描述信息"}
                        </Text>
                        
                        <Flexbox horizontal gap={8}>
                            {item.chatModel && (
                                <MetaItem horizontal gap={4}>
                                    <span style={{ fontSize: 14 }}>📊</span>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {getModelDisplayName(item.chatModel)}
                                    </Text>
                                </MetaItem>
                            )}
                            {item.embeddingModel && (
                                <MetaItem horizontal gap={4}>
                                    <span style={{ fontSize: 14 }}>🔍</span>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {getModelDisplayName(item.embeddingModel)}
                                    </Text>
                                </MetaItem>
                            )}
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </KnowledgeItem>
        );
    }

    return (
        <Flexbox horizontal style={{ width: '100%' }}>
            <Workspace />
            <Flexbox style={{ flex: 1 }}>
                <PageHeader horizontal justify="space-between" align="center">
                    <Title level={4} style={{ margin: 0 }}>知识库管理</Title>
                    <CreateKnowledgePage
                        onSuccess={() => {
                            loadData();
                        }}
                    />
                </PageHeader>
                
                <StyledContainer>
                    {
                        activeWorkspaceId ? (
                            loading ? (
                                <div style={{ textAlign: 'center', width: "100%", padding: "40px 0" }}>
                                    <Spin size="large" tip="加载知识库..." />
                                </div>
                            ) : (
                                knowledges?.length === 0 ? (
                                    <StyledEmpty description="暂无知识库数据" style={{ margin: "40px 0" }} />
                                ) : (
                                    <Flexbox gap={0}>
                                        {knowledges.map((item) => renderItem(item))}
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

Knowledge.displayName = 'Knowledge';

export default Knowledge;
