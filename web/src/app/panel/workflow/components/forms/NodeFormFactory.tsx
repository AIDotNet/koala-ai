import React from 'react';
import { WorkflowNode } from '../../WorkflowDesigner';
import LLMCallNodeForm from './LLMCallNodeForm';
import KnowledgeQueryNodeForm from './KnowledgeQueryNodeForm';
import CustomCodeNodeForm from './CustomCodeNodeForm';
import LoopNodeForm from './LoopNodeForm';
import SelectorNodeForm from './SelectorNodeForm';
import { Typography } from 'antd';

const { Text } = Typography;

interface NodeFormFactoryProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
  knowledgeBases?: Array<{ id: string; name: string }>;
  customModelGroups?: any[];
}

const NodeFormFactory: React.FC<NodeFormFactoryProps> = ({
  node,
  updateNode,
  knowledgeBases = [],
  customModelGroups = []
}) => {
  if (!node) return null;
  
  const nodeType = node.data.nodeType;
  
  switch (nodeType) {
    case 'llm-call':
      return (
        <LLMCallNodeForm 
          node={node} 
          updateNode={updateNode} 
          customModelGroups={customModelGroups} 
        />
      );
      
    case 'knowledge-query':
      return (
        <KnowledgeQueryNodeForm 
          node={node} 
          updateNode={updateNode} 
          knowledgeBases={knowledgeBases} 
        />
      );
    
    case 'loop':
      return (
        <LoopNodeForm
          node={node}
          updateNode={updateNode}
        />
      );
    
    case 'selector':
      return (
        <SelectorNodeForm
          node={node}
          updateNode={updateNode}
        />
      );
      
    case 'custom-code':
      return (
        <CustomCodeNodeForm 
          node={node} 
          updateNode={updateNode} 
        />
      );
      
    case 'input':
      return <Text>输入节点无需配置附加参数</Text>;
      
    case 'output':
      return <Text>输出节点无需配置附加参数</Text>;
      
    default:
      return (
        <Text type="secondary">
          暂不支持此节点类型 ({nodeType}) 的配置表单
        </Text>
      );
  }
};

export default NodeFormFactory; 