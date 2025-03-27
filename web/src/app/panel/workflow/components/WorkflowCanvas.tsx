import { memo, useEffect, useRef, useState } from 'react';
import { WorkflowNode, WorkflowEdge } from '../WorkflowDesigner';
import styles from './WorkflowCanvas.module.css';
import { CustomNode } from './nodes/CustomNode';
import { CustomEdge } from './edges/CustomEdge';
import { Layout } from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  onNodeClick: (event: any, node: WorkflowNode) => void;
  canDeleteNode?: (nodeId: string) => boolean;
}

// 由于我们实际上没有安装ReactFlow库，这里提供一个模拟版本
// 实际使用时应该替换为真正的ReactFlow组件
export const WorkflowCanvas = memo<WorkflowCanvasProps>((props) => {
  const { nodes, edges, onNodeClick, onNodesChange, onEdgesChange, onConnect, canDeleteNode } = props;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });
  const [connectionStartHandle, setConnectionStartHandle] = useState<{ nodeId: string, handleId: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isArranging, setIsArranging] = useState(false);

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    // 修正鼠标位置计算方式
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: (e.clientX - rect.left - position.x) / scale,
        y: (e.clientY - rect.top - position.y) / scale
      });
    }

    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (draggingNodeId) {
      handleNodeDrag(e);
    }
  };

  // 处理节点点击 - 添加防止与拖动冲突的判断
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    // 如果正在拖动则不触发点击
    if (draggingNodeId) return;

    // 如果鼠标有明显移动，则认为是拖动而不是点击
    const hasMoved = Math.abs(e.clientX - (dragStart.x + position.x)) > 5 ||
      Math.abs(e.clientY - (dragStart.y + position.y)) > 5;
    if (hasMoved) return;

    e.stopPropagation();
    setSelectedNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      onNodeClick(e, node);
    }
  };

  // 处理节点拖动开始 - 使用mousedown而不是click
  const handleNodeDragStart = (e: React.MouseEvent<HTMLDivElement>, nodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingNodeId(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      // 修正：计算鼠标相对于节点左上角的偏移
      setDraggingOffset({
        x: (e.clientX - position.x) / scale - node.position.x,
        y: (e.clientY - position.y) / scale - node.position.y
      });
    }
  };

  // 处理节点拖动
  const handleNodeDrag = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const node = nodes.find(n => n.id === draggingNodeId);
      if (node) {
        // 计算新位置，考虑缩放和画布位置
        const newX = (e.clientX - position.x) / scale - draggingOffset.x;
        const newY = (e.clientY - position.y) / scale - draggingOffset.y;

        // 创建更新对象
        const change = {
          id: draggingNodeId,
          type: 'position',
          position: { x: newX, y: newY }
        };

        // 调用父组件的更新函数
        onNodesChange([change]);
      }
    }
  };

  // 处理节点拖动结束
  const handleNodeDragEnd = () => {
    setDraggingNodeId(null);
  };

  // 添加鼠标抬起事件处理
  const handleGlobalMouseUp = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      handleNodeDragEnd();
    }

    if (isDragging) {
      setIsDragging(false);
    }

    // 处理连接线结束 - 查找鼠标下是否有连接点
    if (connectionStartHandle) {
      const handleUnderMouse = findHandleUnderMouse(e.clientX, e.clientY);
      if (handleUnderMouse) {
        handleConnectionEnd(handleUnderMouse.nodeId, handleUnderMouse.handleId);
      } else {
        setConnectionStartHandle(null);
      }
    }
  };

  // 找到鼠标下方的连接点
  const findHandleUnderMouse = (clientX: number, clientY: number): { nodeId: string, handleId: string } | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    
    // 转换为画布坐标，修正坐标计算
    const canvasX = (clientX - rect.left - position.x) / scale;
    const canvasY = (clientY - rect.top - position.y) / scale;

    // 检查所有节点的连接点
    for (const node of nodes) {
      // 只考虑输入连接点（如果当前连接起点是输出连接点）
      if (connectionStartHandle?.handleId.startsWith('output')) {
        if (node.data.inputs) {
          const handleIds = Object.keys(node.data.inputs);
          for (let i = 0; i < handleIds.length; i++) {
            const handleId = handleIds[i];
            const handleY = node.position.y + 40 + 20 + i * 25; // 位置计算与绘制保持一致
            const handleX = node.position.x;

            // 增大检测半径，提高连接成功率
            if (Math.abs(canvasX - handleX) < 20 && Math.abs(canvasY - handleY) < 20) {
              return { nodeId: node.id, handleId: `input-${handleId}` };
            }
          }
        }
      }
      // 只考虑输出连接点（如果当前连接起点是输入连接点）
      else if (connectionStartHandle?.handleId.startsWith('input')) {
        if (node.data.outputs) {
          const handleIds = Object.keys(node.data.outputs);
          for (let i = 0; i < handleIds.length; i++) {
            const handleId = handleIds[i];
            const handleY = node.position.y + 40 + 20 + i * 25;
            const handleX = node.position.x + 200; // 节点宽度

            // 增大检测半径，提高连接成功率
            if (Math.abs(canvasX - handleX) < 20 && Math.abs(canvasY - handleY) < 20) {
              return { nodeId: node.id, handleId: `output-${handleId}` };
            }
          }
        }
      }
    }

    return null;
  };

  // 处理连接点mousedown
  const handleConnectionStart = (nodeId: string, handleId: string) => {
    setConnectionStartHandle({ nodeId, handleId });
  };

  // 处理连接点mouseup
  const handleConnectionEnd = (nodeId: string, handleId: string) => {
    if (connectionStartHandle && connectionStartHandle.nodeId !== nodeId) {
      // 确定源节点和目标节点
      const sourceNodeId = connectionStartHandle.nodeId;
      const sourceHandleId = connectionStartHandle.handleId;
      const targetNodeId = nodeId;
      const targetHandleId = handleId;

      // 允许输出到输入的连接，或者输入到输出的连接
      if ((sourceHandleId.startsWith('output') && targetHandleId.startsWith('input')) || 
          (sourceHandleId.startsWith('input') && targetHandleId.startsWith('output'))) {
        
        let source = sourceNodeId;
        let target = targetNodeId;
        let sourceHandle = sourceHandleId.replace(/^(input|output)-/, '');
        let targetHandle = targetHandleId.replace(/^(input|output)-/, '');
        
        // 如果是从输入连接到输出，调整顺序
        if (sourceHandleId.startsWith('input') && targetHandleId.startsWith('output')) {
          source = targetNodeId;
          target = sourceNodeId;
          sourceHandle = targetHandleId.replace(/^(input|output)-/, '');
          targetHandle = sourceHandleId.replace(/^(input|output)-/, '');
        }
        
        onConnect({
          source,
          target,
          sourceHandle,
          targetHandle
        });
      }
    }
    setConnectionStartHandle(null);
  };

  // 处理画布点击，取消选择
  const handleCanvasClick = () => {
    setSelectedNodeId(null);
    setConnectionStartHandle(null);
  };

  // 处理画布拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggingNodeId && !connectionStartHandle) { // 左键且不是在拖动节点或创建连接
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (draggingNodeId) {
      handleNodeDragEnd();
    }
  };

  // 缩放处理
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.min(Math.max(scale + delta, 0.5), 2);
    setScale(newScale);
  };

  // 计算连接线路径
  const getConnectionPath = () => {
    if (!connectionStartHandle) return '';

    // 找到源节点
    const sourceNode = nodes.find(n => n.id === connectionStartHandle.nodeId);
    if (!sourceNode) return '';

    // 解析连接点信息
    const handleId = connectionStartHandle.handleId;
    const isOutputHandle = handleId.startsWith('output');
    const portKey = handleId.replace(/^(input|output)-/, '');

    // 计算连接点位置
    const NODE_WIDTH = 200;
    const BASE_HEIGHT = 40; // 节点头部高度

    // 计算垂直位置
    let sourceY = sourceNode.position.y + BASE_HEIGHT; // 默认值
    const sourceHandles = isOutputHandle ? sourceNode.data.outputs : sourceNode.data.inputs;

    if (sourceHandles) {
      const keys = Object.keys(sourceHandles);
      const index = keys.indexOf(portKey);
      if (index !== -1) {
        sourceY = sourceNode.position.y + BASE_HEIGHT + 20 + index * 25;
      }
    }

    // 根据是输入还是输出连接点确定水平位置
    const sourceX = isOutputHandle
      ? sourceNode.position.x + NODE_WIDTH
      : sourceNode.position.x;

    // 使用贝塞尔曲线连接起点和鼠标位置 - 改进曲线形状
    const dx = Math.abs(mousePosition.x - sourceX);
    const controlPointOffset = Math.max(60, dx * 0.4); // 增大偏移量，使曲线更明显

    const controlPoint1X = sourceX + (isOutputHandle ? controlPointOffset : -controlPointOffset);
    const controlPoint1Y = sourceY;

    const controlPoint2X = mousePosition.x + (isOutputHandle ? -controlPointOffset : controlPointOffset);
    const controlPoint2Y = mousePosition.y;

    return `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${mousePosition.x} ${mousePosition.y}`;
  };

  // 自动排列节点
  const autoArrangeNodes = () => {
    if (nodes.length === 0 || isArranging) return;
    
    setIsArranging(true);

    if (nodes.length === 0) return;

    // 创建节点依赖图
    const nodeDependencies = new Map<string, Set<string>>();
    const nodeChildren = new Map<string, Set<string>>();
    
    // 初始化
    nodes.forEach(node => {
      nodeDependencies.set(node.id, new Set());
      nodeChildren.set(node.id, new Set());
    });
    
    // 构建依赖关系
    edges.forEach(edge => {
      const sourceId = edge.source;
      const targetId = edge.target;
      
      // 添加依赖关系
      if (nodeDependencies.has(targetId)) {
        nodeDependencies.get(targetId)?.add(sourceId);
      }
      
      // 添加子节点关系
      if (nodeChildren.has(sourceId)) {
        nodeChildren.get(sourceId)?.add(targetId);
      }
    });
    
    // 查找没有依赖的起始节点
    const startNodes: string[] = [];
    nodeDependencies.forEach((deps, nodeId) => {
      if (deps.size === 0) {
        startNodes.push(nodeId);
      }
    });
    
    // 如果没有起始节点，则选择第一个节点
    if (startNodes.length === 0 && nodes.length > 0) {
      startNodes.push(nodes[0].id);
    }
    
    // 层级分配
    const nodeLevels = new Map<string, number>();
    const assignLevels = (nodeId: string, level: number, visited: Set<string> = new Set()) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      // 更新节点层级（取最大值以避免循环依赖问题）
      const currentLevel = nodeLevels.get(nodeId) || 0;
      nodeLevels.set(nodeId, Math.max(currentLevel, level));
      
      // 递归处理子节点
      const children = nodeChildren.get(nodeId) || new Set();
      children.forEach(childId => {
        assignLevels(childId, level + 1, visited);
      });
    };
    
    // 从每个起始节点开始分配层级
    startNodes.forEach(nodeId => {
      assignLevels(nodeId, 0);
    });
    
    // 按层级分组
    const levels = new Map<number, string[]>();
    nodeLevels.forEach((level, nodeId) => {
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)?.push(nodeId);
    });
    
    // 对于没有分配到层级的节点，将其放在最后一层
    const maxLevel = Math.max(...Array.from(levels.keys()), 0);
    nodes.forEach(node => {
      if (!nodeLevels.has(node.id)) {
        if (!levels.has(maxLevel + 1)) {
          levels.set(maxLevel + 1, []);
        }
        levels.get(maxLevel + 1)?.push(node.id);
      }
    });
    
    // 计算每层的节点位置
    const NODE_HORIZONTAL_SPACING = 300;
    const NODE_VERTICAL_SPACING = 150;
    const targetPositions = new Map<string, { x: number, y: number }>();
    
    // 计算新位置
    levels.forEach((nodeIds, level) => {
      const levelWidth = nodeIds.length * NODE_HORIZONTAL_SPACING;
      const startX = -levelWidth / 2 + NODE_HORIZONTAL_SPACING / 2;
      
      nodeIds.forEach((nodeId, index) => {
        const x = startX + index * NODE_HORIZONTAL_SPACING;
        const y = level * NODE_VERTICAL_SPACING + 100;
        
        targetPositions.set(nodeId, { x, y });
      });
    });
    
    // 应用动画效果
    const ANIMATION_STEPS = 20;
    let step = 0;
    
    // 创建初始状态的位置映射
    const initialPositions = new Map<string, { x: number, y: number }>();
    nodes.forEach(node => {
      initialPositions.set(node.id, { ...node.position });
    });
    
    // 居中画布视图
    if (targetPositions.size > 0) {
      // 计算边界
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      targetPositions.forEach(pos => {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + 200); // 考虑节点宽度
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y + 100); // 考虑节点高度
      });
      
      // 计算中心点
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      // 计算画布大小
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        // 计算缩放级别和中心位置
        const canvasCenterX = rect.width / 2;
        const canvasCenterY = rect.height / 2;
        
        // 设置画布位置，使节点集中在画布中央
        setPosition({
          x: canvasCenterX - centerX * scale,
          y: canvasCenterY - centerY * scale
        });
      }
    }
    
    // 动画函数
    const animate = () => {
      if (step >= ANIMATION_STEPS) {
        setIsArranging(false);
        return;
      }
      
      step++;
      const progress = step / ANIMATION_STEPS;
      
      // 计算当前步骤的位置
      const changes: any[] = [];
      initialPositions.forEach((initialPos, nodeId) => {
        const targetPos = targetPositions.get(nodeId);
        if (targetPos) {
          const x = initialPos.x + (targetPos.x - initialPos.x) * progress;
          const y = initialPos.y + (targetPos.y - initialPos.y) * progress;
          
          changes.push({
            id: nodeId,
            type: 'position',
            position: { x, y }
          });
        }
      });
      
      // 应用更改
      onNodesChange(changes);
      
      // 继续下一帧动画
      requestAnimationFrame(animate);
    };
    
    // 开始动画
    requestAnimationFrame(animate);
  };

  // 处理节点删除
  const handleNodeDelete = (nodeId: string) => {
    // 检查是否可以删除该节点
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    if (!nodeToDelete) return;
    
    const nodeType = nodeToDelete.data.nodeType;
    
    // 如果提供了外部的删除检查函数，使用它
    if (canDeleteNode && !canDeleteNode(nodeId)) {
      return;
    }
    
    // 找出与该节点相关的边
    const relatedEdges = edges.filter(
      e => e.source === nodeId || e.target === nodeId
    );
    
    // 删除相关边
    if (relatedEdges.length > 0) {
      const edgeChanges = relatedEdges.map(edge => ({
        id: edge.id,
        type: 'remove'
      }));
      onEdgesChange(edgeChanges);
    }
    
    // 删除节点
    onNodesChange([{ id: nodeId, type: 'remove' }]);
  };

  return (
    <div
      className={styles.canvas}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      ref={canvasRef}
    >
      <div
        className={styles.transformLayer}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        {/* 背景网格 */}
        <div className={styles.grid} />

        {/* 连接线 */}
        <svg className={styles.edges}>
          {edges.map(edge => (
            <CustomEdge
              key={edge.id}
              edge={edge}
              nodes={nodes}
            />
          ))}

          {/* 正在创建的连接线 */}
          {connectionStartHandle && (
            <path
              d={getConnectionPath()}
              stroke="#1677ff"
              strokeWidth={2.5}
              strokeDasharray="5,5"
              fill="none"
            />
          )}
        </svg>

        {/* 节点 */}
        <div className={styles.nodes}>
          {nodes.map(node => (
            <CustomNode
              key={node.id}
              node={node}
              selected={selectedNodeId === node.id}
              onClick={(e) => handleNodeClick(e, node.id)}
              onDragStart={(e) => handleNodeDragStart(e, node.id)}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              onDelete={handleNodeDelete}
              canDelete={canDeleteNode ? canDeleteNode(node.id) : true}
            />
          ))}
        </div>
      </div>

      {/* 控制区域 */}
      <div className={styles.controls}>
        <button onClick={() => setScale(scale + 0.1)}>+</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(Math.max(scale - 0.1, 0.5))}>-</button>
        <button 
          className={`${styles.autoArrangeButton} ${isArranging ? styles.arranging : ''}`} 
          onClick={autoArrangeNodes}
          title="自动排列节点"
          disabled={isArranging}
        >
          <Layout size={16} />
        </button>
      </div>

      {/* 画布信息 */}
      {nodes.length === 0 && (
        <div className={styles.placeholder}>
          <p>拖动左侧节点到此处开始构建工作流</p>
        </div>
      )}
    </div>
  );
});

WorkflowCanvas.displayName = 'WorkflowCanvas'; 