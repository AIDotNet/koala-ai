import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteKnowledge } from '@/services/KnowledgeService';

interface DeleteKnowledgeProps {
    id: string;
    name: string;
    onSuccess: () => void;
}

export const DeleteKnowledge: React.FC<DeleteKnowledgeProps> = ({ id, name, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const showConfirm = () => {
        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: `您确定要删除知识库 "${name}" 吗？此操作不可恢复。`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: handleDelete,
        });
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteKnowledge(id);
            message.success('删除知识库成功');
            onSuccess();
        } catch (error) {
            message.error('删除知识库失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={showConfirm}
            loading={loading}
            size="small"
        >
            删除
        </Button>
    );
}; 