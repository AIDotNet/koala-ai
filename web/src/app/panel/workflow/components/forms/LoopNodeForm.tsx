import React from 'react';
import { Form, Input, Select, InputNumber, Switch } from 'antd';
import { WorkflowNode } from '../../WorkflowDesigner';

const { Option } = Select;

interface LoopNodeFormProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
}

const LoopNodeForm: React.FC<LoopNodeFormProps> = ({
  node,
  updateNode
}) => {
  // 更新节点数据的工具函数
  const handleNodeDataChange = (key: string, value: any) => {
    updateNode(node.id, { ...node.data, [key]: value });
  };

  const loopType = node.data.loopType || 'foreach';

  return (
    <>
      <Form.Item label="循环类型">
        <Select
          value={loopType}
          onChange={(value) => handleNodeDataChange('loopType', value)}
        >
          <Option value="foreach">遍历(ForEach)</Option>
          <Option value="while">条件循环(While)</Option>
          <Option value="fixed">固定次数</Option>
        </Select>
      </Form.Item>
      
      {loopType === 'foreach' && (
        <Form.Item label="遍历变量名">
          <Input
            placeholder="输入变量名，如：item"
            value={node.data.itemVariable || "item"}
            onChange={(e) => handleNodeDataChange('itemVariable', e.target.value)}
          />
        </Form.Item>
      )}
      
      {loopType === 'while' && (
        <Form.Item label="循环条件">
          <Input
            placeholder="输入条件表达式"
            value={node.data.condition || ""}
            onChange={(e) => handleNodeDataChange('condition', e.target.value)}
          />
        </Form.Item>
      )}
      
      {loopType === 'fixed' && (
        <Form.Item label="循环次数">
          <InputNumber
            min={1}
            max={1000}
            value={node.data.iterations || 5}
            onChange={(value) => handleNodeDataChange('iterations', value)}
          />
        </Form.Item>
      )}
      
      <Form.Item label="最大循环次数">
        <InputNumber
          min={1}
          max={1000}
          value={node.data.maxIterations || 100}
          onChange={(value) => handleNodeDataChange('maxIterations', value)}
        />
      </Form.Item>
      
      <Form.Item label="并行执行" valuePropName="checked">
        <Switch
          checked={node.data.parallel || false}
          onChange={(checked) => handleNodeDataChange('parallel', checked)}
        />
      </Form.Item>
    </>
  );
};

export default LoopNodeForm; 