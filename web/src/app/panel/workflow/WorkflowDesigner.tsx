import { memo, useState, useCallback, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Button, Card, Drawer, Space, Tabs, Typography, Tooltip, theme, message, Input, Form, List, Select } from 'antd';
import { ArrowLeft, Save, Play, Zap, Plus, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './WorkflowDesigner.module.css';
import { NodePanel } from './components/NodePanel';
import { WorkflowCanvas } from './components/WorkflowCanvas';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { useToken } = theme;
const { Option } = Select;

// 示例工作流定义
const workflowTemplates = {
  // 空白工作流
  'empty': {
    nodes: [
      {
        id: 'node-input',
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
      },
      {
        id: 'node-output',
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
      }
    ],
    edges: []
  },
  // 聊天机器人工作流
  'wf-1': {
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        position: { x: 100, y: 100 },
        data: {
          label: '用户输入',
          nodeType: 'input',
          inputs: {},
          outputs: {
            'message': 'string'
          }
        }
      },
      {
        id: 'node-2',
        type: 'llm-call',
        position: { x: 400, y: 100 },
        data: {
          label: 'LLM调用',
          nodeType: 'llm-call',
          inputs: {
            'prompt': 'string'
          },
          outputs: {
            'response': 'string'
          },
          config: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000
          }
        }
      },
      {
        id: 'node-3',
        type: 'knowledge-query',
        position: { x: 400, y: 300 },
        data: {
          label: '知识库查询',
          nodeType: 'knowledge-query',
          inputs: {
            'query': 'string'
          },
          outputs: {
            'result': 'string'
          },
          config: {
            kb: 'default-kb',
            topK: 3
          }
        }
      },
      {
        id: 'node-4',
        type: 'output',
        position: { x: 700, y: 200 },
        data: {
          label: '返回结果',
          nodeType: 'output',
          inputs: {
            'result': 'string'
          },
          outputs: {}
        }
      }
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'message',
        targetHandle: 'prompt',
        animated: true
      },
      {
        id: 'edge-1-3',
        source: 'node-1',
        target: 'node-3',
        sourceHandle: 'message',
        targetHandle: 'query'
      },
      {
        id: 'edge-2-4',
        source: 'node-2',
        target: 'node-4',
        sourceHandle: 'response',
        targetHandle: 'result'
      }
    ]
  },
  // 文档摘要工作流
  'wf-2': {
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        position: { x: 100, y: 150 },
        data: {
          label: '文档输入',
          nodeType: 'input',
          inputs: {},
          outputs: {
            'document': 'string'
          }
        }
      },
      {
        id: 'node-2',
        type: 'llm-call',
        position: { x: 400, y: 150 },
        data: {
          label: '文本摘要',
          nodeType: 'llm-call',
          inputs: {
            'text': 'string'
          },
          outputs: {
            'summary': 'string'
          },
          config: {
            model: 'gpt-4',
            temperature: 0.3,
            maxTokens: 500,
            systemPrompt: "请对以下文本生成简洁的摘要，突出关键信息。"
          }
        }
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 700, y: 150 },
        data: {
          label: '摘要结果',
          nodeType: 'output',
          inputs: {
            'summary': 'string'
          },
          outputs: {}
        }
      }
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'document',
        targetHandle: 'text',
        animated: true
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        target: 'node-3',
        sourceHandle: 'summary',
        targetHandle: 'summary'
      }
    ]
  },
  // 图像处理工作流
  'wf-3': {
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        position: { x: 100, y: 200 },
        data: {
          label: '图像输入',
          nodeType: 'input',
          inputs: {},
          outputs: {
            'image': 'file'
          }
        }
      },
      {
        id: 'node-2',
        type: 'image-processing',
        position: { x: 400, y: 100 },
        data: {
          label: '图像识别',
          nodeType: 'image-processing',
          inputs: {
            'image': 'file'
          },
          outputs: {
            'objects': 'array'
          },
          config: {
            model: 'vision-model',
            minConfidence: 0.7
          }
        }
      },
      {
        id: 'node-3',
        type: 'llm-call',
        position: { x: 400, y: 300 },
        data: {
          label: '图像描述',
          nodeType: 'llm-call',
          inputs: {
            'image': 'file'
          },
          outputs: {
            'description': 'string'
          },
          config: {
            model: 'gpt-4-vision',
            maxTokens: 500
          }
        }
      },
      {
        id: 'node-4',
        type: 'output',
        position: { x: 700, y: 200 },
        data: {
          label: '分析结果',
          nodeType: 'output',
          inputs: {
            'objects': 'array',
            'description': 'string'
          },
          outputs: {}
        }
      }
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        target: 'node-2',
        sourceHandle: 'image',
        targetHandle: 'image'
      },
      {
        id: 'edge-1-3',
        source: 'node-1',
        target: 'node-3',
        sourceHandle: 'image',
        targetHandle: 'image'
      },
      {
        id: 'edge-2-4',
        source: 'node-2',
        target: 'node-4',
        sourceHandle: 'objects',
        targetHandle: 'objects'
      },
      {
        id: 'edge-3-4',
        source: 'node-3',
        target: 'node-4',
        sourceHandle: 'description',
        targetHandle: 'description'
      }
    ]
  }
};

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
  
  // 加载工作流数据
  useEffect(() => {
    if (workflowId) {
      setIsLoading(true);
      
      // 这里模拟从API加载数据
      setTimeout(() => {
        // 如果有预定义模板，使用模板，否则创建一个空白工作流
        const template = workflowTemplates[workflowId as keyof typeof workflowTemplates] || workflowTemplates.empty;
        
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
      }, 500);
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
    const workflow = {
      id: workflowId || `wf-${Date.now()}`,
      name: '新工作流',
      description: '',
      nodes,
      edges,
    };
    console.log('保存工作流:', workflow);
    message.success('工作流保存成功');
    // 在此处添加实际保存逻辑
  };

  // 运行工作流
  const runWorkflow = () => {
    console.log('运行工作流');
    message.info('工作流开始执行');
    // 在此处添加运行逻辑
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
          initialValues={{ name: '新工作流', desc: '' }}
          onFinish={(values) => {
            setNodes(nodes.map(node => ({ ...node, data: { ...node.data, label: values.name } })));
            setIsPanelOpen(false);
          }}
        >
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input 
              placeholder="工作流名称" 
              value="新工作流"
              onChange={(e) => {
                setNodes(nodes.map(node => ({ ...node, data: { ...node.data, label: e.target.value } })));
              }}
              style={{ width: 200 }}
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
        <Title level={4} style={{ margin: 0 }}>新工作流</Title>
        <Button 
          type="text" 
          icon={<Settings size={14} />} 
          onClick={() => setIsPanelOpen(true)}
          style={{ padding: '0 4px' }}
        />
      </Flexbox>
    );
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
                
                {/* 根据不同节点类型渲染不同的配置项 */}
                {selectedNode.data.nodeType === 'llm-call' && (
                  <>
                    <Form.Item label="模型">
                      <Input placeholder="选择模型" defaultValue="gpt-3.5-turbo" />
                    </Form.Item>
                    <Form.Item label="提示词">
                      <Input.TextArea rows={4} placeholder="输入提示词模板" />
                    </Form.Item>
                    <Form.Item label="温度">
                      <Input type="number" placeholder="0.1-1.0" defaultValue="0.7" />
                    </Form.Item>
                  </>
                )}
                
                {selectedNode.data.nodeType === 'knowledge-query' && (
                  <>
                    <Form.Item label="知识库">
                      <Input placeholder="选择知识库" />
                    </Form.Item>
                    <Form.Item label="检索数量">
                      <Input type="number" defaultValue="5" />
                    </Form.Item>
                  </>
                )}
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