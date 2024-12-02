import { useWorkspaceStore } from "@/store/workspace";
import { Form, Input, Modal, TextArea } from "@lobehub/ui"
import { Flexbox } from "react-layout-kit";
import { Button, message } from "antd";
import { createWorkspace } from "@/services/WorkspacesService";

const CreateWorkspace = () => {
    const { createWorkspaceModalOpen, setCreateWorkspaceModalOpen,
        loadWorkspaces
     } = useWorkspaceStore();

    async function handleCreateWorkspace(values: any) {
        const result = await createWorkspace(values);
        if (result.success) {
            setCreateWorkspaceModalOpen(false);
            message.success('创建成功');
            loadWorkspaces();
        } else {
            message.error(result.message);
        }
    }

    return <Modal
        footer={[]}
        open={createWorkspaceModalOpen}
        onCancel={() => {
            setCreateWorkspaceModalOpen(false);
        }}
        title='新增工作区'
        width={350}
        onOk={handleCreateWorkspace}
    >
        <Flexbox>
            <Form
                onFinish={handleCreateWorkspace}
            >
                <Form.Item
                    label="工作区名称"
                    name="name"
                    rules={[{ required: true, message: '请输入工作区名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="工作区描述"
                    name="description"
                    rules={[{ required: true, message: '请输入工作区描述' }]}
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

export default CreateWorkspace;
