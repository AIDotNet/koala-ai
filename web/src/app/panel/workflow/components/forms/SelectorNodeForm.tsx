import React from 'react';
import { Form, Input, Select, Radio } from 'antd';
import { WorkflowNode } from '../../WorkflowDesigner';

const { Option } = Select;
const { TextArea } = Input;

interface SelectorNodeFormProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
}

const SelectorNodeForm: React.FC<SelectorNodeFormProps> = ({
  node,
  updateNode
}) => {
  // 更新节点数据的工具函数
  const handleNodeDataChange = (key: string, value: any) => {
    updateNode(node.id, { ...node.data, [key]: value });
  };

  const conditionType = node.data.conditionType || 'expression';

  return (
    <>
      <Form.Item label="条件类型">
        <Radio.Group
          value={conditionType}
          onChange={(e) => handleNodeDataChange('conditionType', e.target.value)}
        >
          <Radio.Button value="expression">表达式</Radio.Button>
          <Radio.Button value="code">代码</Radio.Button>
          <Radio.Button value="template">模板</Radio.Button>
        </Radio.Group>
      </Form.Item>
      
      {conditionType === 'expression' && (
        <Form.Item label="条件表达式">
          <Input
            placeholder="例如: value > 10"
            value={node.data.condition || ""}
            onChange={(e) => handleNodeDataChange('condition', e.target.value)}
          />
        </Form.Item>
      )}
      
      {conditionType === 'code' && (
        <Form.Item label="条件代码">
          <TextArea
            rows={6}
            placeholder="// 返回true或false的代码"
            value={node.data.conditionCode || ""}
            onChange={(e) => handleNodeDataChange('conditionCode', e.target.value)}
          />
        </Form.Item>
      )}
      
      {conditionType === 'template' && (
        <>
          <Form.Item label="条件模板">
            <Select
              value={node.data.conditionTemplate || "equals"}
              onChange={(value) => handleNodeDataChange('conditionTemplate', value)}
            >
              <Option value="equals">等于</Option>
              <Option value="contains">包含</Option>
              <Option value="startsWith">开头是</Option>
              <Option value="endsWith">结尾是</Option>
              <Option value="greater">大于</Option>
              <Option value="less">小于</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="比较值">
            <Input
              placeholder="输入比较值"
              value={node.data.compareValue || ""}
              onChange={(e) => handleNodeDataChange('compareValue', e.target.value)}
            />
          </Form.Item>
        </>
      )}
      
      <Form.Item label="默认路径">
        <Radio.Group
          value={node.data.defaultPath || "yes"}
          onChange={(e) => handleNodeDataChange('defaultPath', e.target.value)}
        >
          <Radio.Button value="yes">Yes</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default SelectorNodeForm; 