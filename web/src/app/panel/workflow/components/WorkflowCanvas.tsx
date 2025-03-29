import { memo, useEffect, useRef, useState } from 'react';
import { WorkflowNode, WorkflowEdge } from '../WorkflowDesigner';
import styles from './WorkflowCanvas.module.css';
import { CustomNode } from './nodes/CustomNode';
import { CustomEdge } from './edges/CustomEdge';
import { Layout } from 'lucide-react';
import { NodeTypes } from './nodes';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (params: any) => void;
  onNodeClick: (event: any, node: WorkflowNode) => void;
  canDeleteNode?: (nodeId: string) => boolean;
  children?: React.ReactNode;
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
            if (Math.abs(canvasX - handleX) < 25 && Math.abs(canvasY - handleY) < 25) {
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
            if (Math.abs(canvasX - handleX) < 25 && Math.abs(canvasY - handleY) < 25) {
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
    console.log(`Connection start: Node ${nodeId}, Handle ${handleId}`);
    setConnectionStartHandle({ nodeId, handleId });
  };

  // 处理连接点mouseup
  const handleConnectionEnd = (nodeId: string, handleId: string) => {
    console.log(`Connection end: Node ${nodeId}, Handle ${handleId}`);
    
    if (connectionStartHandle && connectionStartHandle.nodeId !== nodeId) {
      // 确定源节点和目标节点
      const sourceNodeId = connectionStartHandle.nodeId;
      const sourceHandleId = connectionStartHandle.handleId;
      const targetNodeId = nodeId;
      const targetHandleId = handleId;
      
      console.log(`Attempting to connect: ${sourceHandleId} -> ${targetHandleId}`);

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
        
        // 检查是否已存在相同的连接
        const connectionExists = edges.some(
          edge => edge.source === source && 
                  edge.target === target && 
                  edge.sourceHandle === sourceHandle && 
                  edge.targetHandle === targetHandle
        );
        
        if (!connectionExists) {
          onConnect({
            source,
            target,
            sourceHandle,
            targetHandle
          });
        } else {
          // 可选：显示消息提示已存在连接
          console.log('Connection already exists');
        }
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
    const dy = Math.abs(mousePosition.y - sourceY);
    const controlPointOffset = Math.max(80, dx * 0.6); // 增大偏移量，使曲线更明显

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

    // 创建节点依赖图 - 记录输入和输出依赖
    const incomingEdges = new Map<string, string[]>();
    const outgoingEdges = new Map<string, string[]>();
    
    // 初始化
    nodes.forEach(node => {
      incomingEdges.set(node.id, []);
      outgoingEdges.set(node.id, []);
    });
    
    // 构建依赖关系
    edges.forEach(edge => {
      const sourceId = edge.source;
      const targetId = edge.target;
      
      // 添加出入依赖关系
      incomingEdges.get(targetId)?.push(sourceId);
      outgoingEdges.get(sourceId)?.push(targetId);
    });
    
    // 查找起始节点（没有入边的节点）
    const startNodes: string[] = [];
    incomingEdges.forEach((incoming, nodeId) => {
      if (incoming.length === 0) {
        startNodes.push(nodeId);
      }
    });
    
    // 如果没有起始节点（可能存在环），则随机选一个节点作为起点
    if (startNodes.length === 0 && nodes.length > 0) {
      startNodes.push(nodes[0].id);
    }
    
    // 使用拓扑排序确定节点的水平位置（层级）
    const horizontalLevels = new Map<string, number>();
    const visited = new Set<string>();
    const visiting = new Set<string>(); // 用于检测环
    
    const assignHorizontalLevel = (nodeId: string, level: number = 0) => {
      if (visited.has(nodeId)) return;
      if (visiting.has(nodeId)) {
        // 检测到环，直接返回当前级别
        horizontalLevels.set(nodeId, level);
        return;
      }
      
      visiting.add(nodeId);
      
      // 更新节点水平级别（取最大值以处理有多个入边的情况）
      const currentLevel = horizontalLevels.get(nodeId) || 0;
      horizontalLevels.set(nodeId, Math.max(currentLevel, level));
      
      // 处理所有出边节点，递增层级
      const nextNodes = outgoingEdges.get(nodeId) || [];
      nextNodes.forEach(nextId => {
        assignHorizontalLevel(nextId, level + 1);
      });
      
      visiting.delete(nodeId);
      visited.add(nodeId);
    };
    
    // 从每个起始节点开始分配水平层级
    startNodes.forEach(nodeId => {
      assignHorizontalLevel(nodeId, 0);
    });
    
    // 对于没有通过遍历分配到层级的节点，单独分配
    nodes.forEach(node => {
      if (!horizontalLevels.has(node.id)) {
        // 查找最大层级，使用0作为默认值
        const maxLevel = Math.max(...[...horizontalLevels.values()], 0);
        horizontalLevels.set(node.id, maxLevel + 1);
      }
    });
    
    // 按水平层级分组节点
    const levelGroups = new Map<number, string[]>();
    horizontalLevels.forEach((level, nodeId) => {
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)?.push(nodeId);
    });
    
    // 计算节点的垂直位置 - 使用力导向算法的简化版本
    // 首先，在同一水平层级内，基于节点间的连接确定相对位置
    const verticalPositions = new Map<string, number>();
    
    // 按水平层级处理垂直位置
    Array.from(levelGroups.keys()).sort().forEach(level => {
      const nodesInLevel = levelGroups.get(level) || [];
      
      if (nodesInLevel.length === 0) return;
      
      // 对于每个节点，尝试将其放置在其输入节点的垂直中心位置
      nodesInLevel.forEach(nodeId => {
        // 获取输入节点
        const inputs = incomingEdges.get(nodeId) || [];
        
        if (inputs.length > 0) {
          // 计算输入节点的垂直位置平均值
          let sumY = 0;
          let countInputsWithY = 0;
          
          inputs.forEach(inputId => {
            if (verticalPositions.has(inputId)) {
              sumY += verticalPositions.get(inputId) || 0;
              countInputsWithY++;
            }
          });
          
          if (countInputsWithY > 0) {
            // 将节点垂直位置设置为输入节点的平均位置
            verticalPositions.set(nodeId, sumY / countInputsWithY);
          } else {
            // 如果输入节点还没有位置，使用当前节点的位置
            const node = nodes.find(n => n.id === nodeId);
            verticalPositions.set(nodeId, node ? node.position.y : level * 150);
          }
        } else {
          // 如果没有输入节点，使用当前节点位置
          const node = nodes.find(n => n.id === nodeId);
          verticalPositions.set(nodeId, node ? node.position.y : level * 150);
        }
      });
      
      // 解决同一层级的垂直位置冲突
      const MIN_VERTICAL_SPACING = 120; // 最小垂直间距
      
      // 对同一层级的节点按垂直位置排序
      const sortedByY = [...nodesInLevel].sort((a, b) => {
        const yA = verticalPositions.get(a) || 0;
        const yB = verticalPositions.get(b) || 0;
        return yA - yB;
      });
      
      // 确保节点间有足够间距
      for (let i = 1; i < sortedByY.length; i++) {
        const prevNodeId = sortedByY[i - 1];
        const currNodeId = sortedByY[i];
        
        const prevY = verticalPositions.get(prevNodeId) || 0;
        const currY = verticalPositions.get(currNodeId) || 0;
        
        if (currY < prevY + MIN_VERTICAL_SPACING) {
          verticalPositions.set(currNodeId, prevY + MIN_VERTICAL_SPACING);
        }
      }
    });
    
    // 根据水平层级和垂直位置计算最终坐标
    const HORIZONTAL_SPACING = 300; // 水平间距
    const targetPositions = new Map<string, { x: number, y: number }>();
    
    nodes.forEach(node => {
      const hLevel = horizontalLevels.get(node.id) || 0;
      // 使用计算好的垂直位置，如果没有，则使用当前位置
      const vPos = verticalPositions.has(node.id) 
        ? verticalPositions.get(node.id) || node.position.y
        : node.position.y;
      
      // 计算目标位置
      targetPositions.set(node.id, {
        x: hLevel * HORIZONTAL_SPACING + 100,
        y: vPos
      });
    });
    
    // 应用动画效果
    const ANIMATION_STEPS = 30;
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
              className={styles.connectionLine}
            />
          )}
        </svg>

        {/* 节点 */}
        <div className={styles.nodes}>
          {nodes.map(node => {
            const NodeComponent = (node.data.nodeType && NodeTypes[node.data.nodeType as keyof typeof NodeTypes]) 
              ? NodeTypes[node.data.nodeType as keyof typeof NodeTypes] 
              : CustomNode;
            
            if (node.data.nodeType === 'llm-call') {
              return (
                <NodeComponent
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
              );
            }
            
            return (
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
            );
          })}
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