import { memo, useState } from "react";
import { Flexbox } from 'react-layout-kit';
import { Button, Card, Space, Typography, List, Tag, Empty, Spin, theme } from 'antd';
import { GitBranch, Plus, Clock, User, Calendar, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkflowDesigner from './WorkflowDesigner';
import styles from './Workflow.module.css';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

// 示例工作流数据
const demoWorkflows = [
  {
    id: 'wf-1',
    name: '聊天机器人助手',
    description: '基于LLM的智能问答系统，支持知识库检索和多轮对话。',
    createdBy: '系统',
    createdAt: '2023-10-01',
    lastUpdated: '2023-11-15',
    tags: ['LLM', '知识库', '对话'],
    status: 'published',
    template: true
  },
  {
    id: 'wf-2',
    name: '文档摘要生成器',
    description: '自动分析长文档并生成简洁的摘要内容，提高阅读效率。',
    createdBy: '系统',
    createdAt: '2023-09-10',
    lastUpdated: '2023-10-20',
    tags: ['文档处理', '摘要', 'NLP'],
    status: 'published',
    template: true
  },
  {
    id: 'wf-3',
    name: '图像识别分析',
    description: '上传图像进行物体识别和场景分析，并生成详细的描述报告。',
    createdBy: '系统',
    createdAt: '2023-08-15',
    lastUpdated: '2023-09-25',
    tags: ['图像处理', 'CV', '多模态'],
    status: 'published',
    template: true
  },
  {
    id: 'wf-4',
    name: '数据处理流水线',
    description: '自动化数据清洗、转换和分析流程，支持多种数据源和格式。',
    createdBy: '系统',
    createdAt: '2023-07-20',
    lastUpdated: '2023-08-30',
    tags: ['数据处理', 'ETL', '自动化'],
    status: 'draft',
    template: true
  }
];

const Workflow = memo(() => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [workflows, setWorkflows] = useState(demoWorkflows);
    const { token } = useToken();

    const handleCreateWorkflow = () => {
        navigate('/panel/workflow/designer');
    };

    const handleEditWorkflow = (id: string) => {
        navigate(`/panel/workflow/designer?id=${id}`);
    };

    const handleDuplicateWorkflow = (id: string) => {
        // 在实际应用中，这里会调用API复制工作流
        const workflowToDuplicate = workflows.find(wf => wf.id === id);
        if (workflowToDuplicate) {
            const newWorkflow = {
                ...workflowToDuplicate,
                id: `wf-${Date.now()}`,
                name: `${workflowToDuplicate.name} (复制)`,
                createdAt: new Date().toISOString().split('T')[0],
                lastUpdated: new Date().toISOString().split('T')[0],
                template: false
            };
            setWorkflows([...workflows, newWorkflow]);
        }
    };

    // 生成不同状态和类型的标签颜色
    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'LLM':
            case '知识库':
            case 'NLP':
                return token.colorPrimary;
            case '图像处理':
            case 'CV':
            case '多模态':
                return token.colorSuccess;
            case '数据处理':
            case 'ETL':
            case '自动化':
                return token.colorWarning;
            case '对话':
                return token.colorInfo;
            default:
                return token.colorTextSecondary;
        }
    };

    // 状态标签颜色
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return token.colorSuccess;
            case 'draft':
                return token.colorWarning;
            default:
                return token.colorTextSecondary;
        }
    };

    return (
        <Flexbox padding={24} gap={20} className={styles.workflowContainer}>
            <Flexbox horizontal justify="space-between" align="center">
                <Title level={4} style={{ margin: 0 }}>工作流</Title>
                <Button 
                    type="primary" 
                    icon={<Plus size={16} />}
                    onClick={handleCreateWorkflow}
                >
                    创建工作流
                </Button>
            </Flexbox>
            
            {loading ? (
                <Flexbox align="center" justify="center" padding={100}>
                    <Spin size="large" />
                </Flexbox>
            ) : workflows.length > 0 ? (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
                    dataSource={workflows}
                    renderItem={(item) => (
                        <List.Item>
                            <Card 
                                hoverable
                                className={styles.workflowCard}
                                actions={[
                                    <Button 
                                        type="link" 
                                        onClick={() => handleEditWorkflow(item.id)}
                                        key="edit"
                                    >
                                        编辑
                                    </Button>,
                                    <Button 
                                        type="link" 
                                        onClick={() => handleDuplicateWorkflow(item.id)}
                                        key="duplicate"
                                        icon={<Copy size={14} />}
                                    >
                                        复制
                                    </Button>
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <Flexbox horizontal align="center" justify="space-between">
                                            <Text strong>{item.name}</Text>
                                            <Tag color={getStatusColor(item.status)}>
                                                {item.status === 'published' ? '已发布' : '草稿'}
                                            </Tag>
                                        </Flexbox>
                                    }
                                    description={
                                        <Flexbox gap={12}>
                                            <Paragraph
                                                ellipsis={{ rows: 2 }}
                                                style={{ marginBottom: 8, minHeight: 44 }}
                                            >
                                                {item.description}
                                            </Paragraph>
                                            <Flexbox horizontal wrap="wrap" gap={8}>
                                                {item.tags.map((tag, idx) => (
                                                    <Tag key={idx} color={getTagColor(tag)}>
                                                        {tag}
                                                    </Tag>
                                                ))}
                                            </Flexbox>
                                            <Flexbox gap={4}>
                                                <Flexbox horizontal gap={6} align="center">
                                                    <User size={14} />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {item.createdBy}
                                                    </Text>
                                                </Flexbox>
                                                <Flexbox horizontal gap={6} align="center">
                                                    <Calendar size={14} />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        创建于 {item.createdAt}
                                                    </Text>
                                                </Flexbox>
                                                <Flexbox horizontal gap={6} align="center">
                                                    <Clock size={14} />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        更新于 {item.lastUpdated}
                                                    </Text>
                                                </Flexbox>
                                            </Flexbox>
                                        </Flexbox>
                                    }
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Card>
                    <Flexbox align="center" justify="center" gap={16} padding={40}>
                        <GitBranch size={48} color={token.colorBorder} />
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            暂无工作流，点击上方按钮创建
                        </Text>
                        <Button 
                            type="primary" 
                            icon={<Plus size={16} />}
                            onClick={handleCreateWorkflow}
                        >
                            创建工作流
                        </Button>
                    </Flexbox>
                </Card>
            )}
        </Flexbox>
    );
});

Workflow.displayName = "Workflow";

export default Workflow; 