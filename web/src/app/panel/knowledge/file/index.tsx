import { useState, useEffect } from 'react';
import { Upload, Button, Steps, message, Progress, Typography, Card, Checkbox, Radio, Tooltip, Input, Space, Collapse, Modal, Tabs, Table, Empty, Row, Col } from 'antd';
import { UploadOutlined, InboxOutlined, CloudUploadOutlined, FileTextOutlined, SettingOutlined, CheckCircleOutlined, QuestionCircleOutlined, CaretRightOutlined, FileOutlined, FilePdfOutlined, FileImageOutlined, FileWordOutlined, FileExcelOutlined, FilePptOutlined, LeftOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';
import type { UploadFile, UploadProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Dragger } = Upload;
const { Text, Title } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const useStyles = createStyles(({ css, token }) => ({
    pageContainer: css`
        height: 100vh;
        display: flex;
        flex-direction: column;
    `,
    header: css`
        padding: 16px;
        border-bottom: 1px solid ${token.colorBorderSecondary};
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    headerLeft: css`
        display: flex;
        align-items: center;
        gap: 16px;
    `,
    content: css`
        flex: 1;
        padding: 20px;
        overflow: auto;
    `,
    stepsContainer: css`
        max-width: 800px;
        margin: 0 auto;
        padding: 20px 0;
    `,
    stepsContent: css`
        margin-top: 30px;
        min-height: 300px;
    `,
    buttonsContainer: css`
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 30px;
    `,
    container: css`
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
    `,
    stepContent: css`
        margin-top: 30px;
        min-height: 300px;
    `,
    nextButton: css`
        margin-top: 20px;
    `,
    uploadList: css`
        margin-top: 16px;
    `,
    progressContainer: css`
        margin: 16px 0;
    `,
    fileItem: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid ${token.colorBorder};
    `,
    settingSection: css`
        margin-bottom: 24px;
    `,
    settingLabel: css`
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    `,
    tooltipIcon: css`
        margin-left: 4px;
        color: ${token.colorTextSecondary};
    `,
    inputWithTooltip: css`
        display: flex;
        align-items: center;
    `,
    promptTextarea: css`
        min-height: 120px;
        font-size: 13px;
        font-family: monospace;
    `,
    previewCard: css`
        margin-top: 20px;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.3s;
        &:hover {
            border-color: ${token.colorPrimary};
        }
    `,
    previewTable: css`
        .ant-table-cell {
            padding: 12px 16px;
        }
    `,
    fileIcon: css`
        font-size: 20px;
        margin-right: 8px;
    `,
    filePreviewModal: css`
        .ant-modal-body {
            padding: 0;
        }
    `,
    previewTabs: css`
        .ant-tabs-nav {
            margin-bottom: 0;
            padding: 0 24px;
        }
    `,
    previewContent: css`
        padding: 24px;
        min-height: 300px;
        max-height: 60vh;
        overflow: auto;
    `,
    previewItem: css`
        display: flex;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
            background-color: ${token.colorBgTextHover};
        }
    `,
    previewSelected: css`
        background-color: ${token.colorBgTextActive};
    `,
    chunkItem: css`
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        background-color: ${token.colorBgContainer};
        border: 1px solid ${token.colorBorderSecondary};
        white-space: pre-line;
        line-height: 1.6;
    `,
    previewContainer: css`
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 16px;
        margin-top: 20px;
    `,
    fileListCard: css`
        width: 40%;
        min-width: 300px;
        .ant-card-head-title {
            font-weight: 500;
        }
    `,
    contentPreviewCard: css`
        flex: 1;
        .ant-card-head-title {
            font-weight: 500;
        }
        .ant-card-extra {
            color: ${token.colorTextSecondary};
            font-size: 12px;
        }
    `,
}));

export default function File() {
    const { styles } = useStyles();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState<UploadFile[]>([
        // 添加一个示例文件用于展示
        {
            uid: '-1',
            name: 'AIAgent.pptx',
            status: 'done',
            size: 2048 * 1024, // 2MB
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        } as UploadFile
    ]);
    const [uploading, setUploading] = useState(false);
    
    // 预览状态
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0); // 默认选中第一个文件
    
    // 参数设置状态
    const [pdfEnabled, setPdfEnabled] = useState(true);
    const [processMode, setProcessMode] = useState('qa');
    const [indexEnabled, setIndexEnabled] = useState(true);
    const [customSplit, setCustomSplit] = useState('\\n=======SPLIT==');
    const [chunkSize, setChunkSize] = useState(16000);
    const [useSystemRules, setUseSystemRules] = useState(true);
    
    // QA提示词
    const defaultQAPrompt = `<Context></Context> 假如你是一位文本分析专家，学习和分析，并整理学习成果：\n- 提取问题并给出每个问题的答案。\n- 答案需详细完整，既可能保留原文语法，可以适当扩展答案范围。\n- 答案可以包含普通文本、链接、代码、表格、公式、媒体链接等 Markdown 元素。\n- 最多提供 50 个问答。\n- 生成的问题和答案和原文语言相同。`;
    const [qaPrompt, setQaPrompt] = useState(defaultQAPrompt);

    // 步骤配置
    const steps = [
        {
            title: '选择文件',
            icon: <FileTextOutlined />,
        },
        {
            title: '参数设置',
            icon: <SettingOutlined />,
        },
        {
            title: '数据预览',
            icon: <FileTextOutlined />,
        },
        {
            title: '确认上传',
            icon: <CloudUploadOutlined />,
        },
    ];

    // 文件上传配置
    const uploadProps: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            // 检查文件类型
            const acceptedTypes = ['.txt', '.doc', '.docx', '.csv', '.xlsx', '.pdf', '.md', '.html', '.pptx'];
            const isAcceptedType = acceptedTypes.some(type => file.name.toLowerCase().endsWith(type));
            
            if (!isAcceptedType) {
                message.error(`${file.name} 不是支持的文件类型`);
                return Upload.LIST_IGNORE;
            }
            
            // 检查文件大小
            const isLessThan100MB = file.size / 1024 / 1024 < 100;
            if (!isLessThan100MB) {
                message.error('文件大小不能超过100MB!');
                return Upload.LIST_IGNORE;
            }
            
            setFileList([...fileList, file]);
            return false; // 阻止自动上传
        },
        fileList,
        multiple: true,
    };

    // 处理下一步
    const handleNext = () => {
        if (current === 0 && fileList.length === 0) {
            message.warning('请先选择至少一个文件');
            return;
        }
        
        if (current < steps.length - 1) {
            setCurrent(current + 1);
        } else {
            // 最后一步，模拟上传过程
            handleUpload();
        }
    };

    // 处理上一步
    const handlePrev = () => {
        setCurrent(current - 1);
    };

    // 模拟上传过程
    const handleUpload = () => {
        setUploading(true);
        
        // 模拟上传延迟
        setTimeout(() => {
            setUploading(false);
            message.success('文件上传成功');
            // 这里可以添加上传完成后的逻辑
        }, 2000);
    };

    // 获取文件图标
    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith('.pdf')) return <FilePdfOutlined className={styles.fileIcon} style={{ color: '#ff4d4f' }} />;
        if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) 
            return <FileImageOutlined className={styles.fileIcon} style={{ color: '#13c2c2' }} />;
        if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) 
            return <FileWordOutlined className={styles.fileIcon} style={{ color: '#1677ff' }} />;
        if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) 
            return <FileExcelOutlined className={styles.fileIcon} style={{ color: '#52c41a' }} />;
        if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) 
            return <FilePptOutlined className={styles.fileIcon} style={{ color: '#fa8c16' }} />;
        return <FileOutlined className={styles.fileIcon} style={{ color: '#8c8c8c' }} />;
    };
    
    // 生成示例预览数据
    const generatePreviewData = (fileName: string) => {
        // 这里根据文件类型生成不同的预览数据
        const fileType = fileName.split('.').pop()?.toLowerCase();
        
        // 模拟PPT文件的预览数据 - 匹配截图中的内容
        if (fileType === 'pptx' || fileType === 'ppt') {
            return [
                { id: 1, content: 'BY: 赵家乐', type: 'heading' },
                { id: 2, content: 'AI科技风通用演示模板', type: 'heading' },
                { id: 3, content: 'SemanticKernel简单入门', type: 'heading' },
                { id: 4, content: '深入AgentGroup', type: 'heading' },
                { id: 5, content: 'CodeAgent平台', type: 'heading' },
                { id: 6, content: 'CodeAgent 多Agent演示Demo', type: 'heading' },
                { id: 7, content: 'THANK YOU', type: 'heading' },
                { id: 8, content: 'BY: 赵家乐', type: 'heading' },
                { id: 9, content: 'AIAgent', type: 'heading' },
                { id: 10, content: 'AI Agent (人工智能代理)是一种能够感知环境，做出决策并自主执行动作以完成特定目标的智能系统，它结合了人工智能技术，使计算机系统能够像人类代理一样完成任务。', type: 'paragraph' },
            ];
        }
        
        // 其他文件类型默认预览
        return [
            { id: 1, content: '文件内容预览示例', type: 'heading' },
            { id: 2, content: `这是 ${fileName} 的内容预览。实际应用中，这里会显示文件的实际内容。`, type: 'paragraph' },
            { id: 3, content: '通过点击每个文件项可以查看不同文件的内容。', type: 'paragraph' },
        ];
    };
    
    // 处理文件预览
    const handlePreview = (file: UploadFile, index: number) => {
        // 点击文件只切换选中的文件，不弹出预览弹窗
        setPreviewFile(file);
        setSelectedFileIndex(index);
    };
    
    // 处理查看详情
    const handleViewDetails = () => {
        setPreviewVisible(true);
    };
    
    // 关闭预览
    const handlePreviewClose = () => {
        setPreviewVisible(false);
    };
    
    // 模拟分块数据 - 匹配截图中的内容
    const chunkData = [
        { 
            id: 1, 
            content: 'BY: 赵家乐\nAI科技风通用演示模板\nSemanticKernel简单入门\n深入AgentGroup\nCodeAgent平台\nCodeAgent 多Agent演示Demo\nTHANK YOU' 
        },
        { 
            id: 2, 
            content: 'BY: 赵家乐\nAIAgent\nAI Agent (人工智能代理)是一种能够感知环境，做出决策并自主执行动作以完成特定目标的智能系统，它结合了人工智能技术，使计算机系统能够像人类代理一样完成任务。' 
        },
        { 
            id: 3, 
            content: '• Agent 四大特点:\n  自主性\n  推理与智能\n  感知能力\nAIAgent具有独立运行的能力，能够在无需人类持续干预的情况下进行决策和执行操作，它能根据既定参数自主分析情况并采取相应行动。' 
        },
        { 
            id: 4, 
            content: 'AI代理能够识别和理解信息，从经验中学习，并应用逻辑推理来解决问题或完成任务。\nAI代理能够通过各种输入（如传感器、数据源等）感知其环境，收集决策所需的信息。' 
        },
        { 
            id: 5, 
            content: 'AI代理利用Function（函数）本现代功能力，通过调用各种预定义的函数接口与外部系统交互，执行具体任务或改变环境状态。\n执行能力\nAI代理(AIAgent)的核心特性与应用' 
        },
    ];

    // 组件挂载时设置默认选中第一个文件
    useEffect(() => {
        if (fileList.length > 0) {
            setSelectedFileIndex(0);
            setPreviewFile(fileList[0]);
        }
    }, []);

    // 步骤内容渲染
    const renderStepContent = () => {
        switch (current) {
            case 0:
                return (
                    <div>
                        <Card bordered={false} style={{ boxShadow: 'none' }}>
                            <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                                支持 .txt, .doc, .docx, .csv, .xlsx, .pdf, .md, .html, .pptx 等类型文件，单个文件最大100MB，最多15个文件
                            </Text>
                            
                            <Dragger {...uploadProps} style={{ padding: '24px 0' }}>
                            <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ color: '#1677ff', fontSize: 48 }} />
                                </p>
                                <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 500 }}>
                                    点击或拖动文件到此处上传
                            </p>
                                <p className="ant-upload-hint" style={{ color: '#888' }}>
                                    支持单个或批量上传，严禁上传公司敏感数据
                            </p>
                        </Dragger>
                            
                            {fileList.length > 0 && (
                                <div style={{ marginTop: 24 }}>
                                    <Text strong style={{ marginBottom: 12, display: 'block' }}>
                                        已选择 {fileList.length} 个文件
                                    </Text>
                                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 6 }}>
                                        {fileList.map((file, index) => (
                                            <div 
                                                key={index} 
                                                style={{ 
                                                    padding: '12px 16px', 
                                                    borderBottom: index < fileList.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Flexbox horizontal align="center" style={{ width: '100%' }}>
                                                    {getFileIcon(file.name)}
                                                    <Flexbox style={{ flex: 1 }}>
                                                        <Text ellipsis>{file.name}</Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {(file.size! / 1024 / 1024).toFixed(2)} MB
                                                        </Text>
                                                    </Flexbox>
                                                    <Button 
                                                        type="text" 
                                                        danger
                                                        onClick={() => {
                                                            const newFileList = [...fileList];
                                                            newFileList.splice(index, 1);
                                                            setFileList(newFileList);
                                                        }}
                                                    >
                                                        删除
                                                    </Button>
                                                </Flexbox>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <Card bordered={false} style={{ boxShadow: 'none' }}>
                            <Collapse 
                                defaultActiveKey={['1', '2']} 
                                bordered={false}
                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                style={{ background: 'transparent' }}
                            >
                                <Panel header={<Text strong>文件解析设置</Text>} key="1">
                                    <div className={styles.settingSection}>
                                        <Checkbox 
                                            checked={pdfEnabled}
                                            onChange={(e) => setPdfEnabled(e.target.checked)}
                                        >
                                            <Space align="center">
                                                <span>PDF增强解析</span>
                                                <Tooltip title="优化PDF文件的解析效果">
                                                    <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                </Tooltip>
                                                <Text type="secondary">1页/分</Text>
                                            </Space>
                                        </Checkbox>
                                    </div>
                                </Panel>
                                
                                <Panel header={<Text strong>数据处理方式设置</Text>} key="2">
                                    <div className={styles.settingSection}>
                                        <div className={styles.settingLabel}>处理方式</div>
                                        <Radio.Group 
                                            value={processMode} 
                                            onChange={(e) => setProcessMode(e.target.value)}
                                        >
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Radio value="direct">
                                                    <Space align="center">
                                                        <span>直接分块</span>
                                                        <Tooltip title="按照文本长度直接划分为块">
                                                            <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                        </Tooltip>
                                                    </Space>
                                                </Radio>
                                                <Radio value="qa">
                                                    <Space align="center">
                                                        <span>问答对提取</span>
                                                        <Tooltip title="从文本中提取问答对">
                                                            <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                        </Tooltip>
                                                    </Space>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                    
                                    <div className={styles.settingSection}>
                                        <Text strong>索引增强</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Checkbox 
                                                checked={indexEnabled}
                                                onChange={(e) => setIndexEnabled(e.target.checked)}
                                            >
                                                <Space align="center">
                                                    <span>自动生成补充索引引</span>
                                                    <Tooltip title="自动生成补充索引以提高搜索准确性">
                                                        <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                    </Tooltip>
                                                </Space>
                                            </Checkbox>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.settingSection}>
                                        <Text strong>参数设置</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Radio.Group 
                                                value={useSystemRules ? 'system' : 'custom'} 
                                                onChange={(e) => setUseSystemRules(e.target.value === 'system')}
                                                style={{ width: '100%' }}
                                            >
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <Radio value="system">
                                                        <Space align="center">
                                                            <span>默认</span>
                                                            <Text type="secondary">使用系统默认的参数规则</Text>
                                                        </Space>
                                                    </Radio>
                                                    
                                                    <Radio value="custom">
                                                        <Space align="center">
                                                            <span>自定义</span>
                                                            <Text type="secondary">自定义设置数据处理规则</Text>
                                                        </Space>
                                                    </Radio>
                                                    
                                                    {!useSystemRules && (
                                                        <div style={{ marginLeft: 24, marginTop: 16 }}>
                                                            <div style={{ marginBottom: 16 }}>
                                                                <div className={styles.settingLabel}>
                                                                    <span>理想分块长度</span>
                                                                    <Tooltip title="每个分块的理想字符数">
                                                                        <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                                    </Tooltip>
                                                                </div>
                                                                <Input 
                                                                    value={chunkSize} 
                                                                    onChange={(e) => setChunkSize(Number(e.target.value))}
                                                                    style={{ width: '100%' }}
                                                                    suffix={
                                                                        <div style={{ display: 'flex', gap: 4 }}>
                                                                            <Button 
                                                                                size="small" 
                                                                                type="text"
                                                                                onClick={() => setChunkSize(Math.max(1000, chunkSize - 1000))}
                                                                            >-</Button>
                                                                            <Button 
                                                                                size="small" 
                                                                                type="text"
                                                                                onClick={() => setChunkSize(Math.min(32000, chunkSize + 1000))}
                                                                            >+</Button>
                                                                        </div>
                                                                    }
                                                                />
                                                            </div>
                                                            
                                                            <div style={{ marginBottom: 16 }}>
                                                                <div className={styles.settingLabel}>
                                                                    <span>自定义分隔符</span>
                                                                    <Tooltip title="用于分割文本的自定义字符串">
                                                                        <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                                    </Tooltip>
                                                                </div>
                                                                <Input 
                                                                    value={customSplit} 
                                                                    onChange={(e) => setCustomSplit(e.target.value)}
                                                                    placeholder="输入自定义分隔符"
                                                                />
                                                            </div>
                                                            
                                                            {processMode === 'qa' && (
                                                                <div>
                                                                    <div className={styles.settingLabel}>
                                                                        <span>QA 提示词导词</span>
                                                                        <Tooltip title="提取问答对的提示词">
                                                                            <QuestionCircleOutlined className={styles.tooltipIcon} />
                                                                        </Tooltip>
                                                                    </div>
                                                                    <Input.TextArea 
                                                                        value={qaPrompt} 
                                                                        onChange={(e) => setQaPrompt(e.target.value)}
                                                                        className={styles.promptTextarea}
                                                                        rows={6}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Space>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                        </Card>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <div style={{ flex: 1, borderRight: '1px solid #f0f0f0' }}>
                                <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
                                    <Text strong>文件列表</Text>
                                </div>
                                <div style={{ padding: '12px 16px' }}>
                                    {fileList.length > 0 ? (
                                        fileList.map((file, index) => (
                                            <div 
                                                key={index} 
                                                className={`${styles.previewItem} ${selectedFileIndex === index ? styles.previewSelected : ''}`}
                                                onClick={() => handlePreview(file, index)}
                                            >
                                                <Flexbox horizontal align="center" style={{ width: '100%' }}>
                                                    {getFileIcon(file.name)}
                                                    <Flexbox style={{ flex: 1 }}>
                                                        <Text strong ellipsis>{file.name}</Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {(file.size! / 1024 / 1024).toFixed(2)} MB
                                                        </Text>
                                                    </Flexbox>
                                                </Flexbox>
                                            </div>
                                        ))
                                    ) : (
                                        <Empty description="暂无文件" />
                                    )}
                                </div>
                            </div>
                            
                            <div style={{ flex: 2 }}>
                                <div style={{ 
                                    padding: '16px 16px 12px', 
                                    borderBottom: '1px solid #f0f0f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Text strong>分块预览</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>最多显示 10 个分块</Text>
                                </div>
                                <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
                                    {selectedFileIndex !== null ? (
                                        <Flexbox gap={12}>
                                            {chunkData.map(chunk => (
                                                <div key={chunk.id} className={styles.chunkItem}>
                                                    <Text style={{ whiteSpace: 'pre-line' }}>{chunk.content}</Text>
                                                </div>
                                            ))}
                                        </Flexbox>
                                    ) : (
                                        <Empty description="请选择文件查看分块预览" />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* 文件预览弹窗 */}
                        <Modal
                            title={previewFile?.name}
                            open={previewVisible}
                            onCancel={handlePreviewClose}
                            footer={null}
                            width={800}
                            className={styles.filePreviewModal}
                        >
                            <Tabs defaultActiveKey="preview" className={styles.previewTabs}>
                                <TabPane tab="内容预览" key="preview">
                                    <div className={styles.previewContent}>
                                        {previewFile && (
                                            <Flexbox gap={16}>
                                                {generatePreviewData(previewFile.name).map(item => (
                                                    <div key={item.id}>
                                                        {item.type === 'heading' ? (
                                                            <Title level={5}>{item.content}</Title>
                                                        ) : (
                                                            <Text style={{ whiteSpace: 'pre-line' }}>{item.content}</Text>
                                                        )}
                                                    </div>
                                                ))}
                                            </Flexbox>
                                        )}
                                    </div>
                                </TabPane>
                                <TabPane tab="元数据" key="metadata">
                                    <div className={styles.previewContent}>
                                        <Flexbox gap={12}>
                                            <Flexbox horizontal justify="space-between">
                                                <Text strong>文件名</Text>
                                                <Text>{previewFile?.name}</Text>
                                            </Flexbox>
                                            <Flexbox horizontal justify="space-between">
                                                <Text strong>文件大小</Text>
                                                <Text>{previewFile?.size ? (previewFile.size / 1024 / 1024).toFixed(2) + ' MB' : '未知'}</Text>
                                            </Flexbox>
                                            <Flexbox horizontal justify="space-between">
                                                <Text strong>文件类型</Text>
                                                <Text>{previewFile?.type || previewFile?.name?.split('.').pop()?.toUpperCase() || '未知'}</Text>
                                            </Flexbox>
                                            <Flexbox horizontal justify="space-between">
                                                <Text strong>上传时间</Text>
                                                <Text>{new Date().toLocaleString()}</Text>
                                            </Flexbox>
                                        </Flexbox>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Modal>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <Card bordered={false} style={{ boxShadow: 'none' }}>
                            {uploading ? (
                                <Flexbox gap={16}>
                                    <Text style={{ marginBottom: 16 }}>上传中，请稍候...</Text>
                                    {fileList.map((file, index) => (
                                        <div key={index} style={{ 
                                            border: '1px solid #f0f0f0', 
                                            borderRadius: 6,
                                            padding: '16px', 
                                            marginBottom: 8
                                        }}>
                                            <Flexbox horizontal align="center" gap={12} style={{ marginBottom: 8 }}>
                                                {getFileIcon(file.name)}
                                            <Text>{file.name}</Text>
                                            </Flexbox>
                                            <Progress percent={Math.floor(Math.random() * 100)} status="active" />
                                        </div>
                                    ))}
                                </Flexbox>
                            ) : (
                                <Flexbox gap={16}>
                                    <Flexbox horizontal align="center" gap={12} style={{ padding: '16px 0' }}>
                                        <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                                        <div>
                                            <Text strong style={{ fontSize: 16 }}>文件已准备完成</Text>
                                            <Text type="secondary" style={{ display: 'block' }}>已选择 {fileList.length} 个文件，点击"开始上传"按钮开始上传文件</Text>
                                        </div>
                                    </Flexbox>
                                    
                                    <div style={{ border: '1px solid #f0f0f0', borderRadius: 6 }}>
                                        {fileList.map((file, index) => (
                                            <div 
                                                key={index} 
                                                style={{ 
                                                    padding: '12px 16px', 
                                                    borderBottom: index < fileList.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Flexbox horizontal align="center" style={{ width: '100%' }}>
                                                    {getFileIcon(file.name)}
                                                    <Flexbox style={{ flex: 1 }}>
                                                        <Text ellipsis>{file.name}</Text>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {(file.size! / 1024 / 1024).toFixed(2)} MB
                                                        </Text>
                                                    </Flexbox>
                                                    <Button 
                                                        type="text" 
                                                        danger
                                                        onClick={() => {
                                                            const newFileList = [...fileList];
                                                            newFileList.splice(index, 1);
                                                            setFileList(newFileList);
                                                        }}
                                                    >
                                                        删除
                                                    </Button>
                                                </Flexbox>
                                            </div>
                                        ))}
                                    </div>
                                </Flexbox>
                            )}
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button 
                        type="text" 
                        icon={<LeftOutlined />} 
                        onClick={() => navigate('/panel/knowledge')}
                    />
                    <Text strong>选择文件</Text>
                </div>
                <div>
                    {current > 0 && (
                        <Button onClick={handlePrev} style={{ marginRight: 8 }}>
                            上一步
                        </Button>
                    )}
                    <Button 
                        type="primary" 
                        onClick={handleNext}
                        loading={uploading}
                    >
                        {current < 3 ? '下一步' : '开始上传'}
                    </Button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.stepsContainer}>
                    <Steps 
                        current={current} 
                        items={[
                            {
                                title: '选择文件',
                                status: current === 0 ? 'process' : 'finish',
                                icon: <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    background: current >= 0 ? '#1677ff' : '#ccc', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>1</div>
                            },
                            {
                                title: '参数设置',
                                status: current === 1 ? 'process' : current > 1 ? 'finish' : 'wait',
                                icon: <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    background: current >= 1 ? '#1677ff' : '#ccc', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>2</div>
                            },
                            {
                                title: '数据预览',
                                status: current === 2 ? 'process' : current > 2 ? 'finish' : 'wait',
                                icon: <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    background: current >= 2 ? '#1677ff' : '#ccc', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>3</div>
                            },
                            {
                                title: '确认上传',
                                status: current === 3 ? 'process' : current > 3 ? 'finish' : 'wait',
                                icon: <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    background: current >= 3 ? '#1677ff' : '#ccc', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>4</div>
                            },
                        ]}
                    />
                    
                    <div className={styles.stepsContent}>
                        {renderStepContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

