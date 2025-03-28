import { useParams, useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Button, Empty, Spin, Tag, Tooltip, Typography, Card, Badge, Dropdown, Space, Table, Input } from "antd";
import styled from "styled-components";
import { getKnowledgeInfo } from "@/services/KnowledgeService";
import { LeftOutlined, SearchOutlined, PlusOutlined, MoreOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Workspace from "@/features/Workspace";
import { EditKnowledge } from "../features/EditKnowledge";
import { DeleteKnowledge } from "../features/DeleteKnowledge";
import ModelSelector from "@/components/ModelSelector/ModelSelector";

const { Title, Text } = Typography;

const PageHeader = styled(Flexbox)`
    padding: 16px 24px;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);
    margin-bottom: 0;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

const ContentContainer = styled(Flexbox)`
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    height: calc(100vh - 56px); /* Adjust for header height */
    background-color: #f5f7fa;
`;

const MainContentArea = styled(Flexbox)`
    flex: 1;
    overflow: auto;
    padding: 24px;
`;

const ContentCard = styled(Card)`
    width: 100%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    border-radius: 8px;
    
    .ant-card-head {
        border-bottom: 1px solid rgba(5, 5, 5, 0.06);
        padding: 0 16px;
    }
    
    .ant-card-body {
        padding: 16px;
    }
`;

const InfoSection = styled(Flexbox)`
    width: 320px;
    padding: 24px;
    border-left: 1px solid rgba(5, 5, 5, 0.06);
    overflow: auto;
    height: 100%;
    background-color: #fff;
`;

const InfoItem = styled(Flexbox)`
    margin-bottom: 20px;
`;

const InfoLabel = styled(Text)`
    margin-bottom: 6px;
    font-size: 13px;
`;

const InfoValue = styled(Flexbox)`
    font-size: 14px;
`;

const MetaItem = styled(Flexbox)`
    padding: 6px 12px;
    background-color: #f9f9f9;
    border-radius: 6px;
    align-items: center;
    margin-right: 8px;
`;

const ActionButton = styled(Button)`
    opacity: 0.7;
    &:hover {
        opacity: 1;
    }
`;

const StyledEmpty = styled(Empty)`
    margin: 60px 0;
    color: #888;
    .ant-empty-image {
        margin-bottom: 16px;
    }
`;

const StyledTable = styled(Table)`
    .ant-table-thead > tr > th {
        background-color: #fafafa;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
    }
    
    .ant-table-tbody > tr > td {
        padding: 16px;
    }
    
    .ant-table-tbody > tr:hover > td {
        background-color: #f0f7ff;
    }
`;

const ModelTag = styled(Tag)`
    border-radius: 4px;
    font-size: 12px;
    padding: 2px 8px;
    margin-right: 8px;
`;

const KnowledgeInfo = memo(() => {
    const { knowledgeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [knowledge, setKnowledge] = useState<any>(null);
    const [files, setFiles] = useState<any[]>([]);
    const [embeddingModel, setEmbeddingModel] = useState<string>('');
    const [chatModel, setChatModel] = useState<string>('');
    const [visionModel, setVisionModel] = useState<string>('');

    useEffect(() => {
        if (knowledgeId) {
            loadData();
        }
    }, [knowledgeId]);

    const loadData = () => {
        setLoading(true);
        getKnowledgeInfo(knowledgeId!)
            .then((res: any) => {
                setKnowledge(res.data);
                // 设置模型值
                setEmbeddingModel(res.data.embeddingModel || 'text-embedding-ada-002');
                setChatModel(res.data.chatModel || 'gpt-4o-mini');
                // 设置文件
                setFiles(res.data.files || []);
            })
            .catch(error => {
                console.error("Error fetching knowledge details:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    function getModelDisplayName(model: string | undefined): string {
        if (!model) return '';
        // Shorten display names for common models
        if (model === 'text-embedding-ada-002') return 'Ada-002';
        if (model.startsWith('gpt-')) return model;
        return model;
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Flexbox horizontal align="center" gap={8}>
                    <Text style={{ fontSize: 18, marginRight: 4 }}>{record.icon || "📄"}</Text>
                    <Text strong>{text}</Text>
                </Flexbox>
            ),
        },
        {
            title: '处理模式',
            dataIndex: 'processMode',
            key: 'processMode',
            width: 120,
            render: (text: string) => (
                <Tag color="blue">{text}</Tag>
            ),
        },
        {
            title: '数据量',
            dataIndex: 'dataCount',
            key: 'dataCount',
            width: 100,
            render: (count: number) => (
                <Text strong>{count}</Text>
            ),
        },
        {
            title: '创建/更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (text: string, record: any) => (
                <Flexbox>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.createdAt}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.updatedAt}</Text>
                </Flexbox>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Badge 
                    status="success" 
                    text={<Text style={{ color: '#52c41a' }}>已完成</Text>}
                />
            ),
        },
        {
            title: '启用',
            dataIndex: 'enabled',
            key: 'enabled',
            width: 100,
            render: () => (
                <Switch defaultChecked />
            ),
        },
        {
            title: '',
            dataIndex: 'actions',
            key: 'actions',
            width: 60,
            render: () => (
                <Button type="text" icon={<MoreOutlined />} />
            ),
        },
    ];

    // Mock data for table (replace with actual data)
    const mockFile = {
        name: 'README.md',
        processMode: '直接分块',
        dataCount: 24,
        createdAt: '2024-02-22 01:42',
        updatedAt: '2024-02-22 01:42',
        status: 'completed',
        enabled: true
    };

    return (
        <Flexbox horizontal style={{ width: '100%' }}>
            <Flexbox style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <PageHeader horizontal justify="space-between" align="center">
                    <Flexbox horizontal align="center" gap={16}>
                        <Button 
                            type="text" 
                            icon={<LeftOutlined />} 
                            onClick={() => navigate('/panel/knowledge')}
                        />
                        <Title level={4} style={{ margin: 0 }}>知识库</Title>
                        <Text type="secondary">/</Text>
                        <Text strong>{knowledge?.name || 'te'}</Text>
                    </Flexbox>
                    <Flexbox horizontal gap={12}>
                        <Button icon={<InfoCircleOutlined />}>数据集</Button>
                        <Button type="primary" icon={<SearchOutlined />}>搜索测试</Button>
                    </Flexbox>
                </PageHeader>

                {loading ? (
                    <div style={{ textAlign: 'center', width: "100%", padding: "120px 0", background: "#f5f7fa" }}>
                        <Spin size="large" tip="加载知识库详情..." />
                    </div>
                ) : (
                    <ContentContainer>
                        <MainContentArea>
                            <ContentCard
                                title={
                                    <Flexbox horizontal justify="space-between" align="center" style={{ width: '100%', padding: '12px 0' }}>
                                        <Text strong style={{ fontSize: 16 }}>
                                            文件
                                        </Text>
                                        <Flexbox horizontal gap={8}>
                                            <Input
                                                placeholder="搜索文件"
                                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                                                style={{ width: 200, borderRadius: 6 }}
                                            />
                                            <Dropdown menu={{ items: [{ key: '1', label: '标签' }] }}>
                                                <Button>标签</Button>
                                            </Dropdown>
                                            <Dropdown 
                                                menu={{ 
                                                    items: [
                                                        { 
                                                            key: 'local', 
                                                            label: '本地文件',
                                                            onClick: () => navigate('/panel/knowledge/file'),
                                                            icon: <span style={{ marginRight: 4 }}>📄</span>,
                                                        },
                                                        { 
                                                            key: 'manual', 
                                                            label: '网页数据',
                                                            icon: <span style={{ marginRight: 4 }}>🌐</span>,
                                                        },
                                                        {
                                                            key: 'text',
                                                            label: '自定义文本',
                                                            icon: <span style={{ marginRight: 4 }}>📄</span>,
                                                        }
                                                    ] 
                                                }}
                                                trigger={['click']}
                                                placement="bottomRight"
                                            >
                                                <Button type="primary" icon={<PlusOutlined />}>新建/导入</Button>
                                            </Dropdown>
                                        </Flexbox>
                                    </Flexbox>
                                }
                                bordered={false}
                            >
                                {files.length > 0 ? (
                                    <StyledTable
                                        dataSource={files.length > 0 ? files : [mockFile]}
                                        columns={columns}
                                        rowKey="name"
                                        pagination={false}
                                    />
                                ) : (
                                    <StyledEmpty 
                                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                        description={
                                            <Flexbox>
                                                <Text style={{ fontSize: 16, color: '#888' }}>暂无文件数据</Text>
                                                <Text type="secondary" style={{ fontSize: 13 }}>点击"新建/导入"添加文件到知识库</Text>
                                            </Flexbox>
                                        }
                                    />
                                )}
                            </ContentCard>
                        </MainContentArea>
                        
                        <InfoSection>
                            <Flexbox style={{ width: '100%' }}>
                                <Flexbox horizontal justify="space-between" align="center" style={{ width: '100%', marginBottom: 24 }}>
                                    <Title level={5} style={{ margin: 0 }}>基本信息</Title>
                                    <Space>
                                        {knowledge && (
                                            <>
                                                <EditKnowledge
                                                    id={knowledge.id}
                                                    onSuccess={loadData}
                                                />
                                                <DeleteKnowledge
                                                    id={knowledge.id}
                                                    name={knowledge.name}
                                                    onSuccess={() => navigate('/panel/knowledge')}
                                                />
                                            </>
                                        )}
                                    </Space>
                                </Flexbox>
                                
                                <InfoItem>
                                    <InfoLabel type="secondary">知识库 ID</InfoLabel>
                                    <InfoValue>
                                        <Text copyable style={{ backgroundColor: '#f5f7fa', padding: '4px 8px', borderRadius: 4, fontSize: 13 }}>
                                            {knowledge?.id || '65d0d37d757a6e1c31b6616a'}
                                        </Text>
                                    </InfoValue>
                                </InfoItem>
                                
                                <InfoItem>
                                    <InfoLabel type="secondary">索引模型</InfoLabel>
                                    <InfoValue>
                                        <ModelSelector 
                                            value={embeddingModel}
                                            onChange={(value) => setEmbeddingModel(value)}
                                            modelType="embedding"
                                            width="100%"
                                            showDescription={false}
                                        />
                                        <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>分块上限: 8000</Text>
                                    </InfoValue>
                                </InfoItem>
                                
                                <InfoItem>
                                    <InfoLabel type="secondary">文本处理模型</InfoLabel>
                                    <InfoValue>
                                        <ModelSelector 
                                            value={chatModel}
                                            onChange={(value) => setChatModel(value)}
                                            modelType="chat"
                                            width="100%"
                                            showDescription={false}
                                        />
                                    </InfoValue>
                                </InfoItem>
                                
                                <InfoItem>
                                    <InfoLabel type="secondary">图片处理模型</InfoLabel>
                                    <InfoValue>
                                        <ModelSelector 
                                            value={visionModel}
                                            onChange={(value) => setVisionModel(value)}
                                            modelType="vision"
                                            width="100%"
                                            placeholder="未配置相关模型"
                                            showDescription={false}
                                        />
                                    </InfoValue>
                                </InfoItem>
                                
                                <InfoItem>
                                    <Flexbox horizontal justify="space-between" align="center">
                                        <InfoLabel type="secondary" style={{ margin: 0 }}>定时同步</InfoLabel>
                                        <Switch disabled />
                                    </Flexbox>
                                </InfoItem>
                                
                                <InfoItem>
                                    <InfoLabel type="secondary">协作者</InfoLabel>
                                    <InfoValue>
                                        <Button size="small" type="default" icon={<PlusOutlined />}>管理协作者</Button>
                                    </InfoValue>
                                </InfoItem>
                            </Flexbox>
                        </InfoSection>
                    </ContentContainer>
                )}
            </Flexbox>
        </Flexbox>
    );
});

KnowledgeInfo.displayName = 'KnowledgeInfo';

export default KnowledgeInfo;

// Helper component for illustration
const Switch = ({ defaultChecked = false, disabled = false }) => {
    return (
        <div style={{ 
            width: 40, 
            height: 20, 
            backgroundColor: defaultChecked ? '#1890ff' : '#f0f0f0',
            borderRadius: 10,
            position: 'relative',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            transition: 'background-color 0.3s'
        }}>
            <div style={{
                position: 'absolute',
                width: 16,
                height: 16,
                backgroundColor: 'white',
                borderRadius: 8,
                top: 2,
                left: defaultChecked ? 22 : 2,
                transition: 'left 0.3s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
            }} />
        </div>
    );
};
