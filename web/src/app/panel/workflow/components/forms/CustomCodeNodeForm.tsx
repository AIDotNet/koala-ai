import React from 'react';
import { Form, Input, Select, Typography } from 'antd';
import { WorkflowNode } from '../../WorkflowDesigner';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface CustomCodeNodeFormProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
}

const CustomCodeNodeForm: React.FC<CustomCodeNodeFormProps> = ({
  node,
  updateNode
}) => {
  // 更新节点数据的工具函数
  const handleNodeDataChange = (key: string, value: any) => {
    updateNode(node.id, { ...node.data, [key]: value });
  };

  return (
    <>
      <Form.Item label="代码语言">
        <Select
          value={node.data.language || "javascript"}
          onChange={(value) => handleNodeDataChange('language', value)}
        >
          <Option value="javascript">JavaScript</Option>
          <Option value="python">Python</Option>
          <Option value="typescript">TypeScript</Option>
        </Select>
      </Form.Item>
      
      <Form.Item label="代码">
        <TextArea
          rows={10}
          value={node.data.code || ""}
          onChange={(e) => handleNodeDataChange('code', e.target.value)}
          placeholder="// 编写你的代码"
          style={{ fontFamily: 'monospace' }}
        />
      </Form.Item>
      
      <Form.Item>
        <Text type="secondary">
          提示：代码中可以使用以下变量：
          <ul>
            <li><code>inputs</code>: 节点的输入数据</li>
            <li><code>context</code>: 工作流上下文</li>
            <li>通过 <code>return</code> 语句返回输出数据</li>
          </ul>
        </Text>
      </Form.Item>
      
      <Form.Item label="超时时间(秒)">
        <Input
          type="number"
          value={node.data.timeout || "30"}
          onChange={(e) => handleNodeDataChange('timeout', e.target.value)}
        />
      </Form.Item>
    </>
  );
};

export default CustomCodeNodeForm;