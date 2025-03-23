import { useState, useRef } from 'react';
import { TextArea, EmojiPicker, } from '@lobehub/ui';
import { useLocation } from 'react-router-dom';
import { createKnowledge } from '@/services/KnowledgeService';
import { Modal, Form, Input, Button, Select, Divider, Space, Tag } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';


interface CreateKnowledgePageProps {
    onSuccess: () => void;
}

export const CreateKnowledgePage: React.FC<CreateKnowledgePageProps> = ({ onSuccess }) => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
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

    async function handleSubmit(values: any) {
        const query = new URLSearchParams(location.search);
        const workspaceId = query.get('workspaceId');

        await createKnowledge({
            name: values.name,
            description: values.description,
            categoryId: values.categoryId,
            ragType: values.ragType,
            avatar: avatar,
            embeddingModel: values.embeddingModel,
            chatModel: values.chatModel,
            workspaceId: workspaceId,
        }).then(() => {
            setOpen(false);
            onSuccess();            
        });
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
                <Button type="text" icon={<PlusOutlined />} onClick={(e) => addCustomModel(e as React.MouseEvent<HTMLButtonElement>, type)}>
                    添加模型
                </Button>
            </Space>
        </>
    );

    return (
        <>
            <Modal open={open} footer={null} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
                <Form onFinish={handleSubmit} layout='vertical'>
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
                        <Button block type="primary" htmlType="submit">
                            创建
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Button type="primary" onClick={() => { setOpen(true); }} style={{ width: '100px' }}>
                创建知识库
            </Button>
        </>
    );
}; 