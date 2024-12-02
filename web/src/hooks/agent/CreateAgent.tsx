
import { Form, Input, Modal, TextArea } from "@lobehub/ui"
import { Flexbox } from "react-layout-kit";
import { Button, message } from "antd";
import { useAgentStore } from "@/store/agent";

const CreateAgent = () => {
    const [createAgentModalOpen, setCreateAgentModalOpen] = useAgentStore(state => [state.createAgentModalOpen, state.setCreateAgentModalOpen]);

    const handleCreateAgent = () => {
        setCreateAgentModalOpen(false);
    }

    return <Modal
        footer={[]}
        open={createAgentModalOpen}
        onCancel={() => {
            setCreateAgentModalOpen(false);
        }}
        title='新增应用'
        width={350}
        onOk={handleCreateAgent}
    >
        <Flexbox>
            <Form
                onFinish={handleCreateAgent}
            >
                <Form.Item>
                    
                </Form.Item>
                <Form.Item
                    label="应用名称"
                    name="name"
                    rules={[{ required: true, message: '请输入应用名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="应用介绍"
                    name="introduction"
                    rules={[{ required: true, message: '请输入应用介绍' }]}
                >
                    <TextArea
                        rows={3}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </Flexbox>
    </Modal>
}

export default CreateAgent;
