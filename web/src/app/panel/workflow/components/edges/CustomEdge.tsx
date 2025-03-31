import { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { WorkflowEdge, WorkflowNode } from '../../WorkflowDesigner';
import styles from './CustomEdge.module.css';
import { X } from 'lucide-react';

interface CustomEdgeProps {
  edge: WorkflowEdge;
  nodes: WorkflowNode[];
  onEdgeDelete?: (edgeId: string) => void;
}

export const CustomEdge = memo<CustomEdgeProps>(({ edge, nodes, onEdgeDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteButtonHovered, setIsDeleteButtonHovered] = useState(false);
  // 使用ref保存计算的位置，避免重新渲染时位置变化
  const sourceDeleteButtonPositionRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const targetDeleteButtonPositionRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const middleDeleteButtonPositionRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  
  // 根据节点ID查找源节点和目标节点
  const sourceNode = useMemo(() => 
    nodes.find(node => node.id === edge.source), [nodes, edge.source]);
  
  const targetNode = useMemo(() => 
    nodes.find(node => node.id === edge.target), [nodes, edge.target]);
  
  // 如果无法找到节点，则不渲染
  if (!sourceNode || !targetNode) {
    return null;
  }
  
  // 计算连接线的起点和终点坐标
  // 通常需要根据实际的节点大小和连接点位置进行调整
  const sourceHandleOffset = getHandleOffset(sourceNode, edge.sourceHandle, 'output');
  const targetHandleOffset = getHandleOffset(targetNode, edge.targetHandle, 'input');
  
  const sourceX = sourceNode.position.x + sourceHandleOffset.x;
  const sourceY = sourceNode.position.y + sourceHandleOffset.y;
  
  const targetX = targetNode.position.x + targetHandleOffset.x;
  const targetY = targetNode.position.y + targetHandleOffset.y;
  
  // 计算贝塞尔曲线的控制点
  // 为了让曲线更加平滑，控制点距离源点和目标点的距离与节点之间的距离成正比
  const dx = Math.abs(targetX - sourceX);
  const controlPointOffset = Math.max(50, dx * 0.5);
  
  const controlPoint1X = sourceX + (sourceHandleOffset.isRight ? controlPointOffset : -controlPointOffset);
  const controlPoint1Y = sourceY;
  
  const controlPoint2X = targetX + (targetHandleOffset.isRight ? -controlPointOffset : controlPointOffset);
  const controlPoint2Y = targetY;
  
  // 构建贝塞尔曲线路径
  const path = `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;
  
  // 连接线样式根据边的属性确定
  const strokeColor = edge.style?.stroke || '#1677ff';
  const strokeWidth = edge.style?.strokeWidth || 2;
  const isAnimated = edge.animated === true;
  
  // 计算箭头方向点
  const endX = targetX + (targetHandleOffset.isRight ? -8 : 8);
  const endY = targetY;

  // 确定边标签
  const getEdgeLabel = () => {
    // 优先使用用户设置的标签
    if (edge.data?.label) {
      return edge.data.label;
    }

    // 否则根据连接的端口名称自动生成标签
    const sourceParamName = edge.sourceHandle?.replace('output-', '');
    const targetParamName = edge.targetHandle?.replace('input-', '');
    
    if (sourceParamName && targetParamName) {
      return `${sourceParamName} → ${targetParamName}`;
    } else if (sourceParamName) {
      return sourceParamName;
    } else if (targetParamName) {
      return targetParamName;
    }
    
    return '';
  };
  
  const edgeLabel = getEdgeLabel();
  
  // 只在节点位置变化时计算删除按钮位置，避免频繁重新计算
  useEffect(() => {
    // 计算贝塞尔曲线中点（更精确）
    const t = 0.5; // 曲线上的点，t=0是起点，t=1是终点，t=0.5是中点
    const bezierX = Math.pow(1-t, 3) * sourceX + 
                  3 * Math.pow(1-t, 2) * t * controlPoint1X + 
                  3 * (1-t) * Math.pow(t, 2) * controlPoint2X + 
                  Math.pow(t, 3) * targetX;
                  
    const bezierY = Math.pow(1-t, 3) * sourceY + 
                  3 * Math.pow(1-t, 2) * t * controlPoint1Y + 
                  3 * (1-t) * Math.pow(t, 2) * controlPoint2Y + 
                  Math.pow(t, 3) * targetY;
    
    middleDeleteButtonPositionRef.current = {
      x: bezierX,
      y: bezierY
    };
    
    // 计算源节点附近的删除按钮位置 (t=0.2)
    const tSource = 0.2;
    const sourceButtonX = Math.pow(1-tSource, 3) * sourceX + 
                  3 * Math.pow(1-tSource, 2) * tSource * controlPoint1X + 
                  3 * (1-tSource) * Math.pow(tSource, 2) * controlPoint2X + 
                  Math.pow(tSource, 3) * targetX;
                  
    const sourceButtonY = Math.pow(1-tSource, 3) * sourceY + 
                  3 * Math.pow(1-tSource, 2) * tSource * controlPoint1Y + 
                  3 * (1-tSource) * Math.pow(tSource, 2) * controlPoint2Y + 
                  Math.pow(tSource, 3) * targetY;
                  
    sourceDeleteButtonPositionRef.current = {
      x: sourceButtonX,
      y: sourceButtonY
    };
    
    // 计算目标节点附近的删除按钮位置 (t=0.8)
    const tTarget = 0.8;
    const targetButtonX = Math.pow(1-tTarget, 3) * sourceX + 
                  3 * Math.pow(1-tTarget, 2) * tTarget * controlPoint1X + 
                  3 * (1-tTarget) * Math.pow(tTarget, 2) * controlPoint2X + 
                  Math.pow(tTarget, 3) * targetX;
                  
    const targetButtonY = Math.pow(1-tTarget, 3) * sourceY + 
                  3 * Math.pow(1-tTarget, 2) * tTarget * controlPoint1Y + 
                  3 * (1-tTarget) * Math.pow(tTarget, 2) * controlPoint2Y + 
                  Math.pow(tTarget, 3) * targetY;
                  
    targetDeleteButtonPositionRef.current = {
      x: targetButtonX,
      y: targetButtonY
    };
  }, [sourceX, sourceY, targetX, targetY, controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y]);
  
  // 处理删除按钮点击
  const handleDeleteClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onEdgeDelete) {
      onEdgeDelete(edge.id);
    }
  }, [edge.id, onEdgeDelete]);

  // 鼠标进入/离开连接线
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  // 鼠标进入/离开删除按钮
  const handleDeleteButtonMouseEnter = useCallback(() => {
    setIsDeleteButtonHovered(true);
  }, []);
  
  const handleDeleteButtonMouseLeave = useCallback(() => {
    setIsDeleteButtonHovered(false);
  }, []);
  
  // 创建删除按钮组件
  const renderDeleteButton = (position: {x: number, y: number}) => (
    <g 
      className={styles.edgeDeleteButton}
      onClick={handleDeleteClick}
      transform={`translate(${position.x}, ${position.y})`}
      style={{ opacity: 1 }}
      pointerEvents="all"
      onMouseEnter={handleDeleteButtonMouseEnter}
      onMouseLeave={handleDeleteButtonMouseLeave}
    >
      <circle 
        r="10" 
        className={styles.edgeDeleteButtonBackground}
      />
      <foreignObject 
        width="20" 
        height="20" 
        x="-10" 
        y="-10"
        style={{ pointerEvents: 'none' }}
      >
        <X size={14} color="#ff4d4f" strokeWidth={3} />
      </foreignObject>
    </g>
  );
  
  return (
    <g className={styles.edgeGroup}>
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        className={`${styles.edgePath} ${isAnimated ? styles.animated : ''}`}
        markerEnd={`url(#arrow-${edge.id})`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* 箭头 */}
      <defs>
        <marker
          id={`arrow-${edge.id}`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} className={styles.marker} />
        </marker>
      </defs>
      
      {/* 显示边标签 */}
      {edgeLabel && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 15}
          textAnchor="middle"
          alignmentBaseline="central"
          className={styles.edgeLabel}
        >
          {edgeLabel}
        </text>
      )}
      
      {/* 删除按钮 - 源节点附近 */}
      {onEdgeDelete && renderDeleteButton(sourceDeleteButtonPositionRef.current)}
      
      {/* 删除按钮 - 目标节点附近 */}
      {onEdgeDelete && renderDeleteButton(targetDeleteButtonPositionRef.current)}
      
      {/* 删除按钮 - 中间位置 */}
      {onEdgeDelete && renderDeleteButton(middleDeleteButtonPositionRef.current)}
    </g>
  );
});

// 辅助函数：计算连接点的位置
function getHandleOffset(
  node: WorkflowNode, 
  handleId: string | undefined, 
  type: 'input' | 'output'
): { x: number; y: number; isRight: boolean } {
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 80;
  const BASE_HEIGHT = 40; // 节点头部高度
  
  // 默认值
  let offsetY = BASE_HEIGHT;
  let isRight = type === 'output';
  let offsetX = isRight ? NODE_WIDTH : 0;
  
  if (handleId) {
    // 根据连接点ID计算具体位置
    // 我们假设input在左侧，output在右侧
    // 并且每个连接点垂直间隔10px
    const handleIndex = Object.keys(
      type === 'input' ? node.data.inputs || {} : node.data.outputs || {}
    ).indexOf(handleId);
    
    if (handleIndex !== -1) {
      offsetY = BASE_HEIGHT + 20 + handleIndex * 25;
    }
  }
  
  return { x: offsetX, y: offsetY, isRight };
}

CustomEdge.displayName = 'CustomEdge'; 