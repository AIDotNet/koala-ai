import { useState, useRef, useEffect } from 'react';
import { TextArea, EmojiPicker, } from '@lobehub/ui';
import { getKnowledgeInfo, updateKnowledge } from '@/services/KnowledgeService';
import { Modal, Form, Input, Button, Select, Divider, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

interface EditKnowledgeProps {
    id: string;
    onSuccess: () => void;
}

export const EditKnowledge: React.FC<EditKnowledgeProps> = ({ id, onSuccess }) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const [avatar, setAvatar] = useState('📚');
    const [customEmbeddingModel, setCustomEmbeddingModel] = useState('');
    const [customChatModel, setCustomChatModel] = useState('');
    const [embeddingModels, setEmbeddingModels] = useState([
        'text-embedding-ada-002',
        'text-embedding-3-large',
        'text-embedding-3-small',
        'nomic-embed-text',
        'mxbai-embed-large',
        'snowflake-arctic-embed',
        'bge-m3',
        'bge-large'
    ]);
    const [chatModels, setChatModels] = useState(['gpt-4o']);
    const embeddingInputRef = useRef<InputRef>(null);
    const chatInputRef = useRef<InputRef>(null);

    const fetchKnowledgeDetails = async () => {
        if (!id) return;
        
        setInitialLoading(true);
        try {
            const res = await getKnowledgeInfo(id);
            const knowledge = res.data;
            
            // Set form values
            form.setFieldsValue({
                name: knowledge.name,
                description: knowledge.description,
                ragType: knowledge.ragType,
                embeddingModel: knowledge.embeddingModel,
                chatModel: knowledge.chatModel
            });
            
            // Set avatar
            if (knowledge.avatar) {
                setAvatar(knowledge.avatar);
            }
            
            // Add custom models if they're not in the default list
            if (knowledge.embeddingModel && !embeddingModels.includes(knowledge.embeddingModel)) {
                setEmbeddingModels(prev => [...prev, knowledge.embeddingModel]);
            }
            
            if (knowledge.chatModel && !chatModels.includes(knowledge.chatModel)) {
                setChatModels(prev => [...prev, knowledge.chatModel]);
            }
        } catch (error) {
            message.error('获取知识库详情失败');
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchKnowledgeDetails();
        }
    }, [open, id]);

    async function handleSubmit(values: any) {
        setLoading(true);
        try {
            await updateKnowledge(id, {
                name: values.name,
                description: values.description,
                categoryId: values.categoryId,
                ragType: values.ragType,
                avatar: avatar,
                embeddingModel: values.embeddingModel,
                chatModel: values.chatModel,
            });
            
            message.success('更新知识库成功');
            setOpen(false);
            onSuccess();
        } catch (error) {
            message.error('更新知识库失败');
        } finally {
            setLoading(false);
        }
    }

    const addCustomModel = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, type: 'embedding' | 'chat') => {
        e.preventDefault();
        if (type === 'embedding' && customEmbeddingModel && !embeddingModels.includes(customEmbeddingModel)) {
            setEmbeddingModels([...embeddingModels, customEmbeddingModel]);
            setCustomEmbeddingModel('');
            setTimeout(() => embeddingInputRef.current?.focus(), 0);
        } else if (type === 'chat' && customChatModel && !chatModels.includes(customChatModel)) {
            setChatModels([...chatModels, customChatModel]);
            setCustomChatModel('');
            setTimeout(() => chatInputRef.current?.focus(), 0);
        }
    };

    const handleCustomModelChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'embedding' | 'chat') => {
        if (type === 'embedding') {
            setCustomEmbeddingModel(event.target.value);
        } else {
            setCustomChatModel(event.target.value);
        }
    };

    const removeCustomModel = (model: string, type: 'embedding' | 'chat') => {
        if (type === 'embedding') {
            setEmbeddingModels(embeddingModels.filter(m => m !== model));
        } else {
            setChatModels(chatModels.filter(m => m !== model));
        }
    };

    const renderDropdown = (menu: React.ReactNode, type: 'embedding' | 'chat') => (
        <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
                <Input
                    placeholder={`请输入自定义${type === 'embedding' ? '向量' : '对话'}模型`}
                    ref={type === 'embedding' ? embeddingInputRef : chatInputRef}
                    value={type === 'embedding' ? customEmbeddingModel : customChatModel}
                    onChange={(e) => handleCustomModelChange(e, type)}
                    onKeyDown={(e) => e.stopPropagation()}
                />
                <Button 
                    type="text" 
                    icon={<PlusOutlined />} 
                    onClick={(e) => addCustomModel(e as React.MouseEvent<HTMLButtonElement>, type)}
                >
                    添加模型
                </Button>
            </Space>
        </>
    );

    return (
        <>
            <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => setOpen(true)}
                size="small"
            >
                编辑
            </Button>
            
            <Modal 
                open={open} 
                footer={null} 
                onCancel={() => setOpen(false)} 
                title="编辑知识库"
                confirmLoading={loading}
            >
                {initialLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>加载中...</div>
                ) : (
                    <Form form={form} onFinish={handleSubmit} layout='vertical'>
                        <Form.Item label='知识库图标' name="icon">
                            <EmojiPicker value={avatar} onChange={(e) => { setAvatar(e) }} />
                        </Form.Item>
                        <Form.Item rules={[{ required: true, message: "知识库名称是必须的" }]} label="知识库名称" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label='知识库描述' name="description">
                            <TextArea />
                        </Form.Item>
                        <Form.Item label='RAG类型' name="ragType">
                            <Select options={[
                                { label: '普通知识库', value: 0 },
                                { label: 'Mem0知识库', value: 1 },
                            ]} />
                        </Form.Item>
                        <Form.Item label='向量模型' name="embeddingModel">
                            <Select
                                placeholder='请选择向量模型'
                                dropdownRender={(menu) => renderDropdown(menu, 'embedding')}
                                options={embeddingModels.map((model) => ({
                                    label: (
                                        <Tag closable={!['text-embedding-ada-002', 'text-embedding-3-large', 'text-embedding-3-small', 'nomic-embed-text', 'mxbai-embed-large', 'snowflake-arctic-embed', 'bge-m3', 'bge-large'].includes(model)}
                                            onClose={() => removeCustomModel(model, 'embedding')}>
                                            {model}
                                        </Tag>
                                    ),
                                    value: model
                                }))}
                            />
                        </Form.Item>
                        <Form.Item label='对话模型' name="chatModel">
                            <Select
                                placeholder='请选择对话模型'
                                dropdownRender={(menu) => renderDropdown(menu, 'chat')}
                                options={chatModels.map((model) => ({
                                    label: (
                                        <Tag closable={model !== 'gpt-4o'}
                                            onClose={() => removeCustomModel(model, 'chat')}>
                                            {model}
                                        </Tag>
                                    ),
                                    value: model
                                }))}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button block type="primary" htmlType="submit" loading={loading}>
                                更新
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </>
    );
}; 