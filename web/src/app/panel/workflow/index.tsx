import { memo, useState, useEffect } from "react";
import { Flexbox } from 'react-layout-kit';
import { Button, Card, Space, Typography, List, Tag, Empty, Spin, theme, message, Modal } from 'antd';
import { GitBranch, Plus, Clock, User, Calendar, Copy, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkflowDesigner from './WorkflowDesigner';
import styles from './Workflow.module.css';
import { fetchWorkflows, workflowTemplates, updateWorkflowStatus, createWorkflow } from '../../../services/WorkflowService';
import { WorkflowStatusEnum } from '../../../types/workflow';

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

// 工作流模板数据，用于展示和创建，但不需要从WorkflowService导入，在这里直接列出
const workflowTemplatesList = [
    {
        id: 'template-chat-bot',
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
        id: 'template-doc-summary',
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
        id: 'template-image-processing',
        name: '图像识别分析',
        description: '上传图像进行物体识别和场景分析，并生成详细的描述报告。',
        createdBy: '系统',
        createdAt: '2023-08-15',
        lastUpdated: '2023-09-25',
        tags: ['图像处理', 'CV', '多模态'],
        status: 'published',
        template: true
    }
];

const Workflow = memo(() => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [workflows, setWorkflows] = useState<any[]>([]);
    const { token } = useToken();
    const [workspaceId, setWorkspaceId] = useState<number>(1); // 默认工作空间ID，实际应从上下文获取
    const [templateModalVisible, setTemplateModalVisible] = useState(false);

    // 加载工作流列表
    useEffect(() => {
        fetchWorkflowData();
    }, [workspaceId]);

    // 获取工作流数据
    const fetchWorkflowData = () => {
        setLoading(true);
        fetchWorkflows(workspaceId)
            .then(response => {
                if (response && response.data) {
                    // 将API返回的工作流数据转换为页面显示格式
                    const apiWorkflows = response.data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description || '',
                        createdBy: item.creatorId ? `用户${item.creatorId}` : '系统',
                        createdAt: new Date(item.creationTime).toLocaleDateString(),
                        lastUpdated: new Date(item.lastModificationTime || item.creationTime).toLocaleDateString(),
                        tags: item.tags ? JSON.parse(item.tags) : [],
                        status: getStatusText(item.status),
                        template: false,
                        workspaceId: item.workspaceId,
                        agentId: item.agentId
                    }));
                    setWorkflows(apiWorkflows);
                }
            })
            .catch(error => {
                console.error('获取工作流列表失败:', error);
                message.error('获取工作流列表失败');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 状态文本转换
    const getStatusText = (status: number): string => {
        switch (status) {
            case 0: return 'draft';
            case 1: return 'published';
            case 2: return 'archived';
            case 3: return 'deleted';
            default: return 'draft';
        }
    };

    // 状态数值转换
    const getStatusValue = (status: string): number => {
        switch (status) {
            case 'draft': return 0;
            case 'published': return 1;
            case 'archived': return 2;
            case 'deleted': return 3;
            default: return 0;
        }
    };

    // 打开创建工作流模板选择
    const handleCreateWorkflow = () => {
        setTemplateModalVisible(true);
    };

    // 选择模板创建
    const handleSelectTemplate = (templateId: string) => {
        setTemplateModalVisible(false);
        navigate(`/panel/workflow/designer?id=${templateId}`);
    };

    // 创建空白工作流
    const handleCreateEmpty = async () => {

        const workflowName = '新工作流';
        const workflowDescription = '';
        const workflowTags = '';
        const empty = workflowTemplates.empty;
        const definition = JSON.stringify({
            nodes: empty.nodes,
            edges: empty.edges
        });
        const result = await createWorkflow(workflowName, definition, workspaceId, workflowDescription, workflowTags)
        setTemplateModalVisible(false);
        navigate('/panel/workflow/designer?id='+result.data);

    };

    // 编辑工作流
    const handleEditWorkflow = (id: string) => {
        navigate(`/panel/workflow/designer?id=${id}`);
    };

    // 复制工作流
    const handleDuplicateWorkflow = (id: string) => {
        // 从现有工作流列表中找到要复制的工作流
        const workflowToDuplicate = workflows.find(wf => wf.id.toString() === id);
        if (workflowToDuplicate) {
            // 如果是模板，直接导航到模板设计页面
            if (workflowToDuplicate.template) {
                navigate(`/panel/workflow/designer?id=${id}`);
                return;
            }

            // 提示用户正在复制工作流
            message.loading('正在复制工作流...', 1.5);

            // 这里调用API创建工作流的副本，实际实现需要获取原工作流的详细数据
            // 简化处理，直接导航到原工作流的编辑页面，用户可以另存为新工作流
            setTimeout(() => {
                navigate(`/panel/workflow/designer?id=${id}`);
            }, 1500);
        }
    };

    // 归档工作流
    const handleArchiveWorkflow = (id: number) => {
        updateWorkflowStatus(id, WorkflowStatusEnum.Archived) // 2 = 已归档
            .then(response => {
                message.success('工作流已归档');
                fetchWorkflowData(); // 重新加载数据
            })
            .catch(error => {
                console.error('归档工作流失败:', error);
                message.error('归档工作流失败');
            });
    };

    // 发布工作流
    const handlePublishWorkflow = (id: number) => {
        updateWorkflowStatus(id, WorkflowStatusEnum.Published) // 1 = 已发布
            .then(response => {
                message.success('工作流已发布');
                fetchWorkflowData(); // 重新加载数据
            })
            .catch(error => {
                console.error('发布工作流失败:', error);
                message.error('发布工作流失败');
            });
    };

    // 删除工作流
    const handleDeleteWorkflow = (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个工作流吗？此操作不可恢复。',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                updateWorkflowStatus(id, WorkflowStatusEnum.Deleted)
                    .then(response => {
                        message.success('工作流已删除');
                        fetchWorkflowData(); // 重新加载数据
                    })
                    .catch(error => {
                        console.error('删除工作流失败:', error);
                        message.error('删除工作流失败');
                    });
            }
        });
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
            case 'archived':
                return token.colorTextSecondary;
            case 'deleted':
                return token.colorError;
            default:
                return token.colorTextSecondary;
        }
    };

    // 获取状态显示文本
    const getStatusDisplayText = (status: string) => {
        switch (status) {
            case 'published':
                return '已发布';
            case 'draft':
                return '草稿';
            case 'archived':
                return '已归档';
            case 'deleted':
                return '已删除';
            default:
                return '草稿';
        }
    };

    // 合并API获取的工作流和模板工作流
    const allWorkflows = [...workflows, ...workflowTemplatesList].filter(wf => wf.status !== 'deleted');

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
            ) : allWorkflows.length > 0 ? (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
                    dataSource={allWorkflows}
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
                                    </Button>,
                                    !item.template && item.status === 'draft' && (
                                        <Button
                                            type="link"
                                            onClick={() => handlePublishWorkflow(item.id)}
                                            key="publish"
                                        >
                                            发布
                                        </Button>
                                    ),
                                    !item.template && item.status === 'published' && (
                                        <Button
                                            type="link"
                                            onClick={() => handleArchiveWorkflow(item.id)}
                                            key="archive"
                                        >
                                            归档
                                        </Button>
                                    ),
                                    !item.template && (item.status === 'published' || item.status === 'draft' || item.status === 'archived') && (
                                        <Button
                                            type="link"
                                            onClick={() => handleDeleteWorkflow(item.id)}
                                            key="delete"
                                            danger
                                            icon={<Trash2 size={14} />}
                                        >
                                            删除
                                        </Button>
                                    )
                                ].filter(Boolean)}
                            >
                                <Card.Meta
                                    title={
                                        <Flexbox horizontal align="center" justify="space-between">
                                            <Text strong>{item.name}</Text>
                                            <Tag color={getStatusColor(item.status)}>
                                                {getStatusDisplayText(item.status)}
                                                {item.template && ' (模板)'}
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
                                                {Array.isArray(item.tags) && item.tags.map((tag: string, idx: number) => (
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

            {/* 模板选择模态框 */}
            <Modal
                title="选择工作流模板"
                open={templateModalVisible}
                onCancel={() => setTemplateModalVisible(false)}
                footer={null}
                width={800}
            >
                <Flexbox gap={16} padding={16}>
                    <Card
                        hoverable
                        onClick={handleCreateEmpty}
                        style={{ width: '100%', textAlign: 'center' }}
                    >
                        <Flexbox align="center" justify="center" gap={16}>
                            <Plus size={32} />
                            <Title level={5}>空白工作流</Title>
                            <Text type="secondary">从零开始创建自定义工作流</Text>
                        </Flexbox>
                    </Card>

                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={workflowTemplatesList}
                        renderItem={(template) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    onClick={() => handleSelectTemplate(template.id)}
                                >
                                    <Card.Meta
                                        title={template.name}
                                        description={
                                            <Flexbox gap={8}>
                                                <Text type="secondary" ellipsis={{ tooltip: true }}>
                                                    {template.description}
                                                </Text>
                                                <Flexbox horizontal wrap="wrap" gap={4}>
                                                    {template.tags.map((tag: string, idx: number) => (
                                                        <Tag key={idx} color={getTagColor(tag)}>
                                                            {tag}
                                                        </Tag>
                                                    ))}
                                                </Flexbox>
                                            </Flexbox>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Flexbox>
            </Modal>
        </Flexbox>
    );
});

Workflow.displayName = "Workflow";

export default Workflow; 