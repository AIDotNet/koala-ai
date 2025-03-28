import { CustomNode } from './CustomNode';
import { LLMCallNode } from './LLMCallNode';

// 导出节点组件
export {
  CustomNode,
  LLMCallNode
};

// 节点类型映射
export const NodeTypes: {
  'custom': typeof CustomNode;
  'llm-call': typeof LLMCallNode;
  [key: string]: React.ComponentType<any>;
} = {
  'custom': CustomNode,
  'llm-call': LLMCallNode,
  // 可以添加更多节点类型
}; 