import { memo } from 'react';
import { Collapse, List, Typography, Tooltip } from 'antd';
import { Flexbox } from 'react-layout-kit';
import {
  ArrowRightLeft,
  Brain,
  Database,
  FileImage,
  Mic,
  Repeat,
  Shuffle,
  Code,
  TextCursorInput,
  Cable
} from 'lucide-react';
import styles from './NodePanel.module.css';

const { Panel } = Collapse;
const { Text } = Typography;

interface NodeTypeData {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  data?: any;
}

const nodeTypes: NodeTypeData[] = [
  // 输入输出节点
  {
    key: 'input',
    label: '输入',
    icon: <TextCursorInput size={16} />,
    description: '定义工作流输入参数',
    category: 'io',
    data: {
      inputs: {}, 
      outputs: { output: 'any' }
    }
  },
  {
    key: 'output',
    label: '输出',
    icon: <Cable size={16} />,
    description: '定义工作流输出结果',
    category: 'io',
    data: {
      inputs: { input: 'any' }, 
      outputs: {}
    }
  },
  
  // AI节点
  {
    key: 'llm-call',
    label: 'LLM调用',
    icon: <Brain size={16} />,
    description: '调用大语言模型',
    category: 'ai',
    data: {
      inputs: { prompt: 'string', modelName: 'string' },
      outputs: { output: 'string' }
    }
  },
  {
    key: 'knowledge-query',
    label: '知识库查询',
    icon: <Database size={16} />,
    description: '从知识库中检索相关信息',
    category: 'ai',
    data: {
      inputs: { query: 'string' },
      outputs: { results: 'array' }
    }
  },
  
  // 处理节点
  {
    key: 'image-processing',
    label: '图像处理',
    icon: <FileImage size={16} />,
    description: '处理和分析图像',
    category: 'processing',
    data: {
      inputs: { image: 'file' },
      outputs: { result: 'any' }
    }
  },
  {
    key: 'speech-to-text',
    label: '语音转文本',
    icon: <Mic size={16} />,
    description: '将语音转换为文本',
    category: 'processing',
    data: {
      inputs: { audio: 'file' },
      outputs: { text: 'string' }
    }
  },
  
  // 控制节点
  {
    key: 'selector',
    label: '条件选择器',
    icon: <ArrowRightLeft size={16} />,
    description: '根据条件选择不同的执行路径',
    category: 'control',
    data: {
      inputs: { condition: 'boolean' },
      outputs: { yes: 'any', no: 'any' }
    }
  },
  {
    key: 'loop',
    label: '循环',
    icon: <Repeat size={16} />,
    description: '循环执行特定操作',
    category: 'control',
    data: {
      inputs: { items: 'array' },
      outputs: { result: 'array' }
    }
  },
  {
    key: 'aggregation',
    label: '变量聚合',
    icon: <Shuffle size={16} />,
    description: '聚合和处理多个变量',
    category: 'control',
    data: {
      inputs: { var1: 'any', var2: 'any' },
      outputs: { result: 'any' }
    }
  },
  
  // 自定义节点
  {
    key: 'custom-code',
    label: '自定义代码',
    icon: <Code size={16} />,
    description: '执行自定义代码逻辑',
    category: 'custom',
    data: {
      inputs: { input: 'any' },
      outputs: { output: 'any' }
    }
  },
];

const categoryConfig = {
  io: { title: '输入/输出', key: 'io' },
  ai: { title: 'AI节点', key: 'ai' },
  processing: { title: '处理节点', key: 'processing' },
  control: { title: '控制节点', key: 'control' },
  custom: { title: '自定义节点', key: 'custom' },
};

interface NodePanelProps {
  onAddNode: (nodeType: string, nodeData: any) => void;
}

export const NodePanel = memo<NodePanelProps>(({ onAddNode }) => {
  const groupedNodes = Object.keys(categoryConfig).map(category => {
    const nodes = nodeTypes.filter(node => node.category === category);
    return {
      category,
      title: categoryConfig[category as keyof typeof categoryConfig].title,
      nodes
    };
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, node: NodeTypeData) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (node: NodeTypeData) => {
    onAddNode(node.key, node.data);
  };

  return (
    <Flexbox gap={8} className={styles.nodePanel}>
      <Collapse defaultActiveKey={['ai', 'io']} ghost>
        {groupedNodes.map(group => (
          <Panel header={group.title} key={group.category}>
            <List
              dataSource={group.nodes}
              renderItem={node => (
                <Tooltip title={node.description} placement="right">
                  <div 
                    className={styles.nodeItem}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node)}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className={styles.nodeIcon}>{node.icon}</div>
                    <Text>{node.label}</Text>
                  </div>
                </Tooltip>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </Flexbox>
  );
});

NodePanel.displayName = 'NodePanel'; 