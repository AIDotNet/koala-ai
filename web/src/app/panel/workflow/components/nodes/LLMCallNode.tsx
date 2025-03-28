import { memo, useRef, useState, useEffect } from 'react';
import { WorkflowNode } from '../../WorkflowDesigner';
import { Tooltip, Dropdown, Menu } from 'antd';
import styles from './CustomNode.module.css';
import { Brain, Trash2, ChevronDown } from 'lucide-react';
import ModelSelector, { ModelInfo } from '@/components/ModelSelector';
import { getModelList } from '@/services/modelService';

interface LLMCallNodeProps {
  node: WorkflowNode;
  selected: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDragStart: (event: React.MouseEvent<HTMLDivElement>) => void;
  onConnectionStart: (nodeId: string, handleId: string) => void;
  onConnectionEnd: (nodeId: string, handleId: string) => void;
  onDelete?: (nodeId: string) => void;
  canDelete?: boolean;
}

// 获取模型信息的实用函数
const getModelDisplayInfo = async (modelId: string): Promise<string> => {
  try {
    const res = await getModelList();
    const providers = res.modelProvider || [];
    
    for (const provider of providers) {
      for (const model of provider.models) {
        if (model.id === modelId) {
          return model.displayName;
        }
      }
    }
    
    // 如果找不到模型，则进行简单的格式化显示
    return modelId
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch (error) {
    console.error('获取模型信息失败:', error);
    // 简单格式化显示作为后备方案
    return modelId
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
};

export const LLMCallNode = memo<LLMCallNodeProps>((props) => {
  const { 
    node, 
    selected, 
    onClick, 
    onDragStart,
    onConnectionStart,
    onConnectionEnd,
    onDelete,
    canDelete = true
  } = props;
  
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [modelDisplayName, setModelDisplayName] = useState<string>('请选择模型');
  
  // 加载模型显示名称
  useEffect(() => {
    const modelId = node.data.modelId || '';
    if (modelId) {
      getModelDisplayInfo(modelId).then(displayName => {
        setModelDisplayName(displayName);
      });
    } else {
      setModelDisplayName('请选择模型');
    }
  }, [node.data.modelId]);

  // 处理连接点的鼠标事件
  const handleConnectionHandleMouseDown = (e: React.MouseEvent, handleId: string) => {
    e.stopPropagation();
    e.preventDefault();
    onConnectionStart(node.id, handleId);
  };

  // 处理连接点的鼠标移入/移出
  const handleConnectionHandleMouseEnter = (handleId: string) => {
    setHoveredHandle(handleId);
  };

  const handleConnectionHandleMouseLeave = () => {
    setHoveredHandle(null);
  };
  
  // 处理节点拖动
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    
    if ((e.target as HTMLElement).closest(`.${styles.nodeHandle}`)) {
      return;
    }
    
    if ((e.target as HTMLElement).closest(`.${styles.nodeHeader}`)) {
      setIsDragging(true);
      onDragStart(e);
    }
  };
  
  // 处理鼠标松开
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const dx = Math.abs(e.clientX - mouseDownPos.x);
    const dy = Math.abs(e.clientY - mouseDownPos.y);
    
    if (dx < 5 && dy < 5 && !isDragging) {
      onClick(e);
    }
    
    setIsDragging(false);
  };

  // 处理删除节点
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(node.id);
    }
  };

  const nodeColor = '#d3adf7'; // 紫色，与图片一致

  return (
    <Tooltip title={`${node.data.label || 'LLM调用'} (${modelDisplayName})`} placement="top">
      <div
        ref={nodeRef}
        className={`${styles.node} ${selected ? styles.selected : ''}`}
        style={{
          position: 'absolute',
          left: node.position.x,
          top: node.position.y,
          borderColor: nodeColor,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setShowDeleteButton(true)}
        onMouseLeave={() => setShowDeleteButton(false)}
      >
        <div className={styles.nodeHeader} style={{ backgroundColor: nodeColor }}>
          <div className={styles.nodeIcon}><Brain size={16} /></div>
          <div className={styles.nodeTitle}>{node.data.label || 'LLM调用'}</div>
          {showDeleteButton && canDelete && (
            <div 
              className={styles.nodeDeleteButton}
              onClick={handleDelete}
              title="删除节点"
            >
              <Trash2 size={14} />
            </div>
          )}
        </div>

        <div className={styles.nodeBody}>
          {/* 显示模型名称 */}
          <div className={styles.nodeModelInfo}>
            {modelDisplayName}
          </div>
          
          {/* 输入连接点 */}
          {node.data.inputs && Object.keys(node.data.inputs).length > 0 && (
            <div className={styles.nodeInputs}>
              {Object.entries(node.data.inputs).map(([id, type]) => (
                <div key={`input-${id}`} className={styles.nodePort}>
                  <div 
                    className={`${styles.nodeHandle} ${hoveredHandle === `input-${id}` ? styles.nodeHandleHovered : ''}`} 
                    data-handle-id={`input-${id}`}
                    onMouseDown={(e) => handleConnectionHandleMouseDown(e, `input-${id}`)}
                    onMouseEnter={() => handleConnectionHandleMouseEnter(`input-${id}`)}
                    onMouseLeave={handleConnectionHandleMouseLeave}
                  />
                  <span className={styles.nodePortLabel}>{id}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* 输出连接点 */}
          {node.data.outputs && Object.keys(node.data.outputs).length > 0 && (
            <div className={styles.nodeOutputs}>
              {Object.entries(node.data.outputs).map(([id, type]) => (
                <div key={`output-${id}`} className={styles.nodePort}>
                  <span className={styles.nodePortLabel}>{id}</span>
                  <div 
                    className={`${styles.nodeHandle} ${hoveredHandle === `output-${id}` ? styles.nodeHandleHovered : ''}`} 
                    data-handle-id={`output-${id}`}
                    onMouseDown={(e) => handleConnectionHandleMouseDown(e, `output-${id}`)}
                    onMouseEnter={() => handleConnectionHandleMouseEnter(`output-${id}`)}
                    onMouseLeave={handleConnectionHandleMouseLeave}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Tooltip>
  );
});

LLMCallNode.displayName = 'LLMCallNode';

export default LLMCallNode; 