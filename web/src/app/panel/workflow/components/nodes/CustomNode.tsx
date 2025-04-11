import { memo, useRef, useState } from 'react';
import { WorkflowNode } from '../../WorkflowDesigner';
import { Badge, Tooltip } from 'antd';
import styles from './CustomNode.module.css';
import {
  Brain,
  Database,
  FileImage,
  Mic,
  ArrowRightLeft,
  Repeat,
  Shuffle,
  FileInput,
  FileOutput,
  Code,
  Trash2
} from 'lucide-react';

interface CustomNodeProps {
  node: WorkflowNode;
  selected: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDragStart: (event: React.MouseEvent<HTMLDivElement>) => void;
  onConnectionStart: (nodeId: string, handleId: string) => void;
  onConnectionEnd: (nodeId: string, handleId: string) => void;
  onDelete?: (nodeId: string) => void;
  canDelete?: boolean;
}

// 节点图标映射
const nodeIcons: Record<string, React.ReactNode> = {
  'input': <FileInput size={16} />,
  'output': <FileOutput size={16} />,
  'llm-call': <Brain size={16} />,
  'knowledge-query': <Database size={16} />,
  'image-processing': <FileImage size={16} />,
  'speech-to-text': <Mic size={16} />,
  'selector': <ArrowRightLeft size={16} />,
  'loop': <Repeat size={16} />,
  'aggregation': <Shuffle size={16} />,
  'custom-code': <Code size={16} />,
};

// 节点颜色映射
const nodeColors: Record<string, string> = {
  'input': '#91caff',
  'output': '#b7eb8f',
  'llm-call': '#d3adf7',
  'knowledge-query': '#adc6ff',
  'image-processing': '#ffadd2',
  'speech-to-text': '#ffd666',
  'selector': '#87e8de',
  'loop': '#ffa39e',
  'aggregation': '#ffbb96',
  'custom-code': '#d9d9d9',
};

export const CustomNode = memo<CustomNodeProps>(({ 
  node, 
  selected, 
  onClick, 
  onDragStart,
  onConnectionStart,
  onConnectionEnd,
  onDelete,
  canDelete = true
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  
  // 处理连接点的鼠标事件
  const handleConnectionHandleMouseDown = (e: React.MouseEvent, handleId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(false); // 确保拖动状态被重置
    onConnectionStart(node.id, handleId);
  };

  // 处理连接点的鼠标移入
  const handleConnectionHandleMouseEnter = (handleId: string) => {
    setHoveredHandle(handleId);
  };

  // 处理连接点的鼠标移出
  const handleConnectionHandleMouseLeave = () => {
    setHoveredHandle(null);
  };
  
  // 处理节点拖动
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 如果点击的是连接点，不处理拖动
    if ((e.target as HTMLElement).closest(`.${styles.nodeHandle}`) ||
        (e.target as HTMLElement).closest(`.${styles.nodeHandle}::after`)) {
      return;
    }
    
    // 记录初始鼠标位置，用于判断是点击还是拖动
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    
    // 只有当点击的是节点头部时才能拖动
    if ((e.target as HTMLElement).closest(`.${styles.nodeHeader}`)) {
      setIsDragging(true);
      onDragStart(e);
    }
  };
  
  // 处理鼠标松开
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // 计算鼠标移动距离
    const dx = Math.abs(e.clientX - mouseDownPos.x);
    const dy = Math.abs(e.clientY - mouseDownPos.y);
    
    // 如果鼠标几乎没有移动，认为是点击而不是拖动
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

  const nodeType = node.data.nodeType || 'default';
  const nodeColor = nodeColors[nodeType] || '#d9d9d9';
  const nodeIcon = nodeIcons[nodeType] || <Code size={16} />;

  return (
    <Tooltip title={`${node.data.label} (${nodeType})`} placement="top">
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
          <div className={styles.nodeIcon}>{nodeIcon}</div>
          <div className={styles.nodeTitle}>{node.data.label}</div>
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
          {/* 输入连接点 */}
          {node.data.inputs && Object.keys(node.data.inputs).length > 0 && (
            <div className={styles.nodeInputs}>
              {Object.entries(node.data.inputs).map(([id, type]) => (
                <div key={`input-${id}`} className={styles.nodePort}>
                  <div 
                    className={`${styles.nodeHandle} ${hoveredHandle === `input-${id}` ? styles.nodeHandleHovered : ''}`} 
                    data-handle-id={`input-${id}`}
                    data-testid={`handle-input-${id}`}
                    onClick={(e) => e.stopPropagation()}
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
                    data-testid={`handle-output-${id}`}
                    onClick={(e) => e.stopPropagation()}
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

CustomNode.displayName = 'CustomNode'; 