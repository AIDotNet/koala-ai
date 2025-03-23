import { useParams, useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { Flexbox } from "react-layout-kit";
import { Button, Empty, Spin, Tag, Tooltip, Typography, Card, Badge, Dropdown, Space, Table, Input } from "antd";
import styled from "styled-components";
import { getKnowledgeInfo } from "@/services/KnowledgeService";
import { LeftOutlined, SearchOutlined, PlusOutlined, MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Workspace from "@/features/Workspace";
import { EditKnowledge } from "../features/EditKnowledge";
import { DeleteKnowledge } from "../features/DeleteKnowledge";

const { Title, Text } = Typography;

const PageHeader = styled(Flexbox)`
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 0;
`;

const ContentContainer = styled(Flexbox)`
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    height: calc(100vh - 56px); /* Adjust for header height */
`;

const MainContentArea = styled(Flexbox)`
    flex: 1;
    overflow: auto;
    padding: 16px;
`;

const InfoSection = styled(Flexbox)`
    width: 300px;
    padding: 24px;
    border-left: 1px solid #f0f0f0;
    overflow: auto;
    height: 100%;
`;

const InfoItem = styled(Flexbox)`
    margin-bottom: 16px;
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
    margin: 40px 0;
    color: #888;
    .ant-empty-image {
        margin-bottom: 16px;
    }
`;

const KnowledgeInfo = memo(() => {
    const { knowledgeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [knowledge, setKnowledge] = useState<any>(null);
    const [files, setFiles] = useState<any[]>([]);

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
                // Assuming files are in the response data
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
                    {record.icon || "📄"}
                    <Text>{text}</Text>
                </Flexbox>
            ),
        },
        {
            title: '处理模式',
            dataIndex: 'processMode',
            key: 'processMode',
            width: 120,
        },
        {
            title: '数据量',
            dataIndex: 'dataCount',
            key: 'dataCount',
            width: 100,
        },
        {
            title: '创建/更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (text: string, record: any) => (
                <Flexbox>
                    <Text type="secondary">{record.createdAt}</Text>
                    <Text type="secondary">{record.updatedAt}</Text>
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
                    text="已完成" 
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
                    <Flexbox horizontal gap={8}>
                        <Button>数据集</Button>
                        <Button type="primary">搜索测试</Button>
                    </Flexbox>
                </PageHeader>

                {loading ? (
                    <div style={{ textAlign: 'center', width: "100%", padding: "80px 0" }}>
                        <Spin size="large" tip="加载知识库详情..." />
                    </div>
                ) : (
                    <ContentContainer>
                        <MainContentArea>
                            <Flexbox gap={16} style={{ width: '100%' }}>
                                <Flexbox horizontal justify="space-between" align="center" style={{ width: '100%' }}>
                                    <Text strong style={{ fontSize: 16 }}>
                                        文件
                                    </Text>
                                    <Flexbox horizontal gap={8}>
                                        <Input
                                            placeholder="搜索"
                                            prefix={<SearchOutlined />}
                                            style={{ width: 200 }}
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
                                
                                {files.length > 0 ? (
                                    <Table
                                        dataSource={files.length > 0 ? files : [mockFile]}
                                        columns={columns}
                                        rowKey="name"
                                        pagination={false}
                                    />
                                ) : (
                                    <StyledEmpty description="暂无文件数据" />
                                )}
                            </Flexbox>
                        </MainContentArea>
                        
                        <InfoSection>
                            <Flexbox style={{ width: '100%' }}>
                                <Flexbox horizontal justify="space-between" align="center" style={{ width: '100%', marginBottom: 16 }}>
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
                                    <Text type="secondary">知识库 ID</Text>
                                    <Text copyable>{knowledge?.id || '65d0d37d757a6e1c31b6616a'}</Text>
                                </InfoItem>
                                
                                <InfoItem>
                                    <Text type="secondary">索引模型</Text>
                                    <Flexbox horizontal align="center" gap={8}>
                                        <Text>{getModelDisplayName(knowledge?.embeddingModel || 'text-embedding-ada-002')}</Text>
                                        <Text type="secondary">分块上限: 8000</Text>
                                    </Flexbox>
                                </InfoItem>
                                
                                <InfoItem>
                                    <Text type="secondary">文本处理模型</Text>
                                    <Text>{knowledge?.chatModel || 'GPT-4o-mini'}</Text>
                                </InfoItem>
                                
                                <InfoItem>
                                    <Text type="secondary">图片处理模型</Text>
                                    <Text>未配置相关模型</Text>
                                </InfoItem>
                                
                                <InfoItem>
                                    <Text type="secondary">定时同步</Text>
                                    <Switch disabled />
                                </InfoItem>
                                
                                <InfoItem>
                                    <Text type="secondary">协作者</Text>
                                    <Button size="small">管理协作者</Button>
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
            opacity: disabled ? 0.6 : 1
        }}>
            <div style={{
                position: 'absolute',
                width: 16,
                height: 16,
                backgroundColor: 'white',
                borderRadius: 8,
                top: 2,
                left: defaultChecked ? 22 : 2,
                transition: 'left 0.3s'
            }} />
        </div>
    );
};
