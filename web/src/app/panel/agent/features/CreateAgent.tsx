import { Button } from 'antd';
import { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { createAgent } from '@/services/AgentService';
import { TextArea, EmojiPicker } from '@lobehub/ui'
import {
    useLocation
} from 'react-router-dom'

export const CreateAgentPage: React.FC = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState('🤖')

    function handleSubmit(values: any) {
        const query = new URLSearchParams(location.search);
        const workspaceId = query.get('workspaceId');

        // 校验

        createAgent({
            name: values.name,
            workSpaceId: workspaceId,
            introduction: values.introduction,
            avatar: avatar,
        })
        console.log(values, workspaceId);
    }

    return <>
        <Modal open={open} footer={null}
            onCancel={() => setOpen(false)}
            onOk={() => setOpen(false)}
        >
            <Form
                onFinish={handleSubmit}
                layout='vertical'
            >
                <Form.Item label='应用图标' 
                    name="icon">
                    <EmojiPicker
                        value={avatar}
                        onChange={(e) => { setAvatar(e) }}
                    />
                </Form.Item>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message:"应用名称是必须的"
                        }
                    ]} label="应用名称" name="name">
                    <Input />
                </Form.Item>
                <Form.Item 
                    rules={[
                        {
                            required: true,
                            message:"应用描述是必须的"
                        }
                    ]} label='应用描述' name="introduction">
                    <TextArea />
                </Form.Item>
                <Form.Item>
                    <Button
                        block
                        type="primary" htmlType="submit">
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
        <Button type="primary"
            onClick={() => {
                setOpen(true);
            }}
            style={{
                width: '100px',
            }}
        >
            创建应用
        </Button>

    </>
}
