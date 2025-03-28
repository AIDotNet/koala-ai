import React from 'react';
import { Form, Input, Select } from 'antd';
import { WorkflowNode } from '../../WorkflowDesigner';

const { Option } = Select;

interface KnowledgeQueryNodeFormProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
  knowledgeBases?: Array<{ id: string; name: string }>;
}

const KnowledgeQueryNodeForm: React.FC<KnowledgeQueryNodeFormProps> = ({
  node,
  updateNode,
  knowledgeBases = []
}) => {
  // 更新节点数据的工具函数
  const handleNodeDataChange = (key: string, value: any) => {
    updateNode(node.id, { ...node.data, [key]: value });
  };

  return (
    <>
      <Form.Item label="知识库">
        <Select
          placeholder="选择知识库"
          value={node.data.knowledgeBaseId}
          onChange={(value) => handleNodeDataChange('knowledgeBaseId', value)}
        >
          {knowledgeBases.map(kb => (
            <Option key={kb.id} value={kb.id}>{kb.name}</Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item label="检索数量">
        <Input 
          type="number" 
          value={node.data.topK || "5"} 
          onChange={(e) => handleNodeDataChange('topK', e.target.value)}
        />
      </Form.Item>
      
      <Form.Item label="相似度阈值">
        <Input 
          type="number" 
          placeholder="0.0-1.0" 
          value={node.data.threshold || "0.7"} 
          onChange={(e) => handleNodeDataChange('threshold', e.target.value)}
        />
      </Form.Item>
      
      <Form.Item label="检索模式">
        <Select
          value={node.data.retrievalMode || "hybrid"}
          onChange={(value) => handleNodeDataChange('retrievalMode', value)}
        >
          <Option value="semantic">语义检索</Option>
          <Option value="keyword">关键词检索</Option>
          <Option value="hybrid">混合检索</Option>
        </Select>
      </Form.Item>
    </>
  );
};

export default KnowledgeQueryNodeForm; 