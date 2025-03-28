import { useState, useRef } from 'react';
import { TextArea, EmojiPicker, } from '@lobehub/ui';
import { useLocation } from 'react-router-dom';
import { createKnowledge } from '@/services/KnowledgeService';
import { Modal, Form, Input, Button, Divider, Select } from 'antd';
import { ModelSelector } from '@/components/ModelSelector';

interface CreateKnowledgePageProps {
    onSuccess: () => void;
}

export const CreateKnowledgePage: React.FC<CreateKnowledgePageProps> = ({ onSuccess }) => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('📚');

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
                        <Select
                            placeholder='请选择RAG类型'
                            options={[
                                { label: '普通知识库', value: 0 },
                                { label: 'Mem0知识库', value: 1 },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label='向量模型' name="embeddingModel">
                        <ModelSelector
                            placeholder='请选择向量模型'
                            modelType='embedding'
                        />
                    </Form.Item>
                    <Form.Item label='对话模型' name="chatModel">
                        <ModelSelector
                            placeholder='请选择对话模型'
                            modelType='chat'
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