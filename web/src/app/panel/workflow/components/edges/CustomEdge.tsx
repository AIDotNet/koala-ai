import { memo, useMemo } from 'react';
import { WorkflowEdge, WorkflowNode } from '../../WorkflowDesigner';
import styles from './CustomEdge.module.css';

interface CustomEdgeProps {
  edge: WorkflowEdge;
  nodes: WorkflowNode[];
}

export const CustomEdge = memo<CustomEdgeProps>(({ edge, nodes }) => {
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
  
  return (
    <>
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        className={`${styles.edgePath} ${isAnimated ? styles.animated : ''}`}
        markerEnd={`url(#arrow-${edge.id})`}
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
      
      {/* 如果有边标签，则显示标签 */}
      {edge.data?.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor="middle"
          alignmentBaseline="central"
          className={styles.edgeLabel}
        >
          {edge.data.label}
        </text>
      )}
    </>
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