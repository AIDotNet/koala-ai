import { useState, useEffect } from 'react';
import { TextArea, EmojiPicker, } from '@lobehub/ui';
import { getKnowledgeInfo, updateKnowledge } from '@/services/KnowledgeService';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { ModelSelector } from '@/components/ModelSelector';

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