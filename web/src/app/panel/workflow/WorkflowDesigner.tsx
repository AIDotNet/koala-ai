import { memo, useState, useCallback, useEffect, } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Button, Card, Drawer, Space, Tabs, Typography, theme, message, Input, Form, List, Select } from 'antd';
import { ArrowLeft, Save, Zap, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './WorkflowDesigner.module.css';
import { NodePanel } from './components/NodePanel';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { workflowTemplates, getWorkflow, updateWorkflow, executeWorkflow } from '../../../services/WorkflowService';

import NodeFormFactory from './components/forms';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { useToken } = theme;
const { Option } = Select;

export interface WorkflowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    nodeType: string;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    config?: Record<string, any>;
    [key: string]: any;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
  };
  data?: {
    label?: string;
  };
}

// 自定义模型组示例
const customModelGroups = [
  {
    icon: "OpenAI",
    name: "自定义模型组 1",
    models: [
      {
        id: "custom-model-1",
        model: "custom-model-1",
        displayName: "自定义模型 1",
        description: "这是一个自定义模型示例"
      },
      {
        id: "custom-model-2",
        model: "custom-model-2",
        displayName: "自定义模型 2"
      }
    ]
  }
];

const WorkflowDesigner = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const { token } = useToken();

  // 状态
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isNodePanelOpen, setIsNodePanelOpen] = useState(true);
  const [isNodeSettingOpen, setIsNodeSettingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState('新工作流');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowTags, setWorkflowTags] = useState('');
  const [workspaceId, setWorkspaceId] = useState<number>(1); // 默认工作空间ID，实际应从上下文获取

  // 加载工作流数据
  useEffect(() => {
    if (workflowId) {
      setIsLoading(true);

      // 从API加载数据
      if (workflowId.startsWith('template-')) {
        // 如果是模板ID，使用预定义模板
        const templateId = workflowId.replace('template-', '');
        const template = workflowTemplates[templateId as keyof typeof workflowTemplates] || workflowTemplates.empty;

        // 确保工作流中至少有一个输入节点和一个输出节点
        let workflowNodes = [...template.nodes];
        let hasInput = workflowNodes.some(node => node.data.nodeType === 'input');
        let hasOutput = workflowNodes.some(node => node.data.nodeType === 'output');

        // 如果没有输入节点，添加一个
        if (!hasInput) {
          workflowNodes.push({
            id: `node-input-${Date.now()}`,
            type: 'input',
            position: { x: 100, y: 200 },
            data: {
              label: '输入',
              nodeType: 'input',
              inputs: {},
              outputs: {
                'data': 'any'
              }
            }
          });
        }

        // 如果没有输出节点，添加一个
        if (!hasOutput) {
          workflowNodes.push({
            id: `node-output-${Date.now()}`,
            type: 'output',
            position: { x: 500, y: 200 },
            data: {
              label: '输出',
              nodeType: 'output',
              inputs: {
                'result': 'any'
              },
              outputs: {}
            }
          });
        }

        setNodes(workflowNodes);
        setEdges(template.edges);
        setIsLoading(false);
      } else {
        // 如果是真实ID，从API获取
        getWorkflow(Number(workflowId))
          .then(response => {
            if (response && response.data) {
              const workflow = response.data;
              setWorkflowName(workflow.name);
              setWorkflowDescription(workflow.description || '');
              setWorkflowTags(workflow.tags || '');

              try {
                // 解析工作流定义
                const definition = JSON.parse(workflow.definition);
                setNodes(definition.nodes || []);
                setEdges(definition.edges || []);
              } catch (error) {
                console.error('工作流定义解析失败:', error);
                message.error('工作流定义格式不正确');
                // 使用空工作流
                const emptyTemplate = workflowTemplates.empty;
                setNodes(emptyTemplate.nodes);
                setEdges(emptyTemplate.edges);
              }
            }
          })
          .catch(error => {
            console.error('获取工作流失败:', error);
            message.error('获取工作流失败');
            // 使用空工作流
            const emptyTemplate = workflowTemplates.empty;
            setNodes(emptyTemplate.nodes);
            setEdges(emptyTemplate.edges);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      // 新建工作流时，默认添加输入和输出节点
      const defaultNodes = workflowTemplates.empty.nodes;
      setNodes(defaultNodes);
      setEdges([]);
    }
  }, [workflowId]);

  // 节点变更处理
  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      // 处理各种类型的节点变更
      return changes.reduce((acc: WorkflowNode[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter(n => n.id !== change.id);
        } else if (change.type === 'position') {
          return acc.map(n => n.id === change.id ? { ...n, position: change.position } : n);
        }
        return acc;
      }, [...nds]);
    });
  }, []);

  // 连线变更处理
  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => {
      return changes.reduce((acc: WorkflowEdge[], change: any) => {
        if (change.type === 'remove') {
          return acc.filter(e => e.id !== change.id);
        }
        return acc;
      }, [...eds]);
    });
  }, []);

  // 节点点击处理
  const onNodeClick = useCallback((event: any, node: WorkflowNode) => {
    // 打开节点设置抽屉，修改selectedNode
    setSelectedNode(node);
    setIsNodeSettingOpen(true);
    // 不要在这里修改节点面板的状态
  }, []);

  // 连接创建处理
  const onConnect = useCallback((params: any) => {
    setEdges((eds) => [...eds, {
      id: `e${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle,
      animated: true,
    }]);
  }, []);

  // 添加节点
  const addNode = useCallback((nodeType: string, nodeData: any) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      position: { x: 250, y: 150 + nodes.length * 80 },
      data: {
        label: nodeData.label || nodeType,
        nodeType: nodeType,
        ...nodeData
      }
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  // 检查节点是否可以删除
  const canDeleteNode = useCallback((nodeId: string) => {
    // 找到要删除的节点
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return false;

    const nodeType = node.data.nodeType;

    // 统计当前节点类型数量
    const nodeTypeCounts = nodes.reduce((counts, node) => {
      const type = node.data.nodeType;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    // 如果是输入节点或输出节点，且只有一个该类型的节点，则不允许删除
    if ((nodeType === 'input' && nodeTypeCounts['input'] <= 1) ||
      (nodeType === 'output' && nodeTypeCounts['output'] <= 1)) {
      return false;
    }

    return true;
  }, [nodes]);

  // 保存工作流
  const saveWorkflow = () => {
    // 构建工作流定义JSON
    const definition = JSON.stringify({
      nodes,
      edges,
    });

    setIsLoading(true);

    if (workflowId && !workflowId.startsWith('template-')) {
      updateWorkflow(Number(workflowId), workflowName, definition, workflowDescription, workflowTags)
        .then(() => {
          message.success('工作流保存成功');
        })
        .catch(error => {
          console.error('保存工作流失败:', error);
          message.error('保存工作流失败');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      message.error("抱歉，当前工作流模板不能保存");
    }
  };

  // 运行工作流
  const runWorkflow = () => {
    if (!workflowId || workflowId.startsWith('template-')) {
      message.warning('请先保存工作流再运行');
      return;
    }

    // 构建工作流定义JSON
    const definition = JSON.stringify({
      nodes,
      edges,
    });

    setIsLoading(true);
    executeWorkflow(Number(workflowId), definition)
      .then(response => {
        if (response && response.data) {
          message.success(`工作流开始执行，实例ID: ${response.data}`);
        }
      })
      .catch(error => {
        console.error('执行工作流失败:', error);
        message.error('执行工作流失败');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 返回列表
  const goBack = () => {
    navigate('/panel/workflow');
  };

  // 渲染工作流名称部分
  const renderWorkflowName = () => {
    if (isPanelOpen) {
      return (
        <Form
          layout="inline"
          initialValues={{ name: workflowName, desc: workflowDescription }}
          onFinish={(values) => {
            setWorkflowName(values.name);
            setWorkflowDescription(values.desc);
            setIsPanelOpen(false);
          }}
        >
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input
              placeholder="工作流名称"
              onChange={(e) => {
                setWorkflowName(e.target.value);
              }}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="desc" style={{ marginBottom: 0 }}>
            <Input
              placeholder="工作流描述"
              onChange={(e) => {
                setWorkflowDescription(e.target.value);
              }}
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">确定</Button>
          </Form.Item>
        </Form>
      );
    }

    return (
      <Flexbox horizontal gap={8} align="center">
        <Title level={4} style={{ margin: 0 }}>{workflowName}</Title>
        <Button
          type="text"
          icon={<Settings size={14} />}
          onClick={() => setIsPanelOpen(true)}
          style={{ padding: '0 4px' }}
        />
      </Flexbox>
    );
  };

  // 处理节点数据变更
  const handleNodeDataChange = (nodeId: string, newData: any) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData
          }
        };
      }
      return node;
    }));
  };

  return (
    <Flexbox padding={0} className={styles.workflowDesigner}>
      <Flexbox
        horizontal
        justify="space-between"
        align="center"
        className={styles.toolbar}
        style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Flexbox horizontal gap={16} align="center">
          <Button type="text" icon={<ArrowLeft size={18} />} onClick={goBack}>
            返回
          </Button>
          {renderWorkflowName()}
        </Flexbox>
        <Space>
          <Button onClick={runWorkflow} type="primary" icon={<Zap size={16} />}>
            运行
          </Button>
          <Button onClick={saveWorkflow} type="primary" icon={<Save size={16} />}>
            保存
          </Button>
        </Space>
      </Flexbox>

      <Flexbox horizontal className={styles.workflowContent}>
        {isNodePanelOpen && (
          <Card
            className={styles.nodePanel}
            title="节点类型"
            size="small"
            style={{
              borderRight: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: 0
            }}
            extra={
              <Button
                type="text"
                icon={<ChevronLeft size={14} />}
                onClick={() => setIsNodePanelOpen(false)}
              />
            }
          >
            <NodePanel onAddNode={addNode} />
          </Card>
        )}

        <Flexbox flex={1} className={styles.canvasWrapper}>
          {!isNodePanelOpen && (
            <Button
              className={styles.expandButton}
              type="text"
              icon={<ChevronRight size={14} />}
              onClick={() => setIsNodePanelOpen(true)}
            />
          )}

          <Card
            className={styles.canvasContainer}
            bodyStyle={{ padding: 0, height: '100%' }}
            bordered={false}
          >
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              canDeleteNode={canDeleteNode}
            />
          </Card>
        </Flexbox>
      </Flexbox>

      <Drawer
        title={
          <Flexbox horizontal justify="space-between">
            <span>节点设置</span>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {selectedNode?.id}
            </Text>
          </Flexbox>
        }
        placement="right"
        open={isNodeSettingOpen}
        onClose={() => setIsNodeSettingOpen(false)}
        width={400}
        styles={{
          header: { borderBottom: `1px solid ${token.colorBorderSecondary}` },
        }}
      >
        {selectedNode && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本设置" key="1">
              <Form layout="vertical">
                <Form.Item label="节点名称" initialValue={selectedNode.data.label}>
                  <Input
                    placeholder="输入节点名称"
                    onChange={(e) => {
                      setNodes(nodes.map(node =>
                        node.id === selectedNode.id
                          ? { ...node, data: { ...node.data, label: e.target.value } }
                          : node
                      ));
                    }}
                  />
                </Form.Item>

                <Form.Item label="节点类型">
                  <Input disabled value={selectedNode.data.nodeType} />
                </Form.Item>

                <NodeFormFactory
                  node={selectedNode}
                  updateNode={(nodeId, data) => {
                    setNodes(nodes.map(node =>
                      node.id === nodeId
                        ? { ...node, data }
                        : node
                    ));
                  }}
                  customModelGroups={customModelGroups}
                  knowledgeBases={[
                    { id: 'kb1', name: '知识库1' },
                    { id: 'kb2', name: '知识库2' }
                  ]}
                />
              </Form>
            </TabPane>

            <TabPane tab="输入/输出" key="2">
              <Flexbox gap={16}>
                {selectedNode.data.inputs && Object.keys(selectedNode.data.inputs).length > 0 && (
                  <Card size="small" title="输入参数" bordered>
                    <List
                      dataSource={Object.entries(selectedNode.data.inputs)}
                      renderItem={([key, type]) => (
                        <List.Item>
                          <Typography.Text strong>{key}</Typography.Text>
                          <Typography.Text type="secondary">类型: {String(type)}</Typography.Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                )}

                {selectedNode.data.outputs && Object.keys(selectedNode.data.outputs).length > 0 && (
                  <Card size="small" title="输出参数" bordered>
                    <List
                      dataSource={Object.entries(selectedNode.data.outputs)}
                      renderItem={([key, type]) => (
                        <List.Item>
                          <Typography.Text strong>{key}</Typography.Text>
                          <Typography.Text type="secondary">类型: {String(type)}</Typography.Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                )}
              </Flexbox>
            </TabPane>

            <TabPane tab="高级设置" key="3">
              <Card size="small" bordered>
                <Flexbox gap={16}>
                  <Form layout="vertical">
                    <Form.Item label="错误处理">
                      <Select placeholder="选择错误处理方式">
                        <Option value="continue">继续执行</Option>
                        <Option value="retry">重试</Option>
                        <Option value="stop">停止执行</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="超时时间">
                      <Input type="number" addonAfter="秒" defaultValue="30" />
                    </Form.Item>
                  </Form>
                  <div>
                    <Typography.Title level={5}>节点数据</Typography.Title>
                    <pre
                      style={{
                        padding: 8,
                        background: token.colorFillTertiary,
                        borderRadius: 6,
                        fontSize: 12,
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(selectedNode.data, null, 2)}
                    </pre>
                  </div>
                </Flexbox>
              </Card>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </Flexbox>
  );
});

WorkflowDesigner.displayName = 'WorkflowDesigner';

export default WorkflowDesigner; 