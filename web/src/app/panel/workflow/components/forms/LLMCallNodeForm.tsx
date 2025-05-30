import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, Typography, Alert } from 'antd';
import { WorkflowNode } from '../../WorkflowDesigner';
import ModelSelector, { ModelGroup } from '@/components/ModelSelector';
import { initModelConfig } from '@/utils/modelConfigHelper';

const { Text } = Typography;

interface LLMCallNodeFormProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
  customModelGroups?: ModelGroup[];
}

const LLMCallNodeForm: React.FC<LLMCallNodeFormProps> = ({ 
  node, 
  updateNode,
  customModelGroups
}) => {
  const [form] = Form.useForm();
  const [modelGroups, setModelGroups] = useState<ModelGroup[]>([]);
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [selectedModelId, setSelectedModelId] = useState(node.data.modelId || '');
  const [availableParams, setAvailableParams] = useState<string[]>([]);

  // 初始化模型数据和selectedModelId
  useEffect(() => {
    const groups = initModelConfig();
    setModelGroups(groups);
    setSelectedModelId(node.data.modelId || '');
  }, []);

  // 当node.data.modelId从外部更新时，同步到本地状态
  useEffect(() => {
    if (node.data.modelId !== selectedModelId) {
      setSelectedModelId(node.data.modelId || '');
    }
  }, [node.data.modelId]);

  // 获取输入参数列表
  useEffect(() => {
    if (node.data.inputs) {
      setAvailableParams(Object.keys(node.data.inputs));
    }
  }, [node.data.inputs]);

  // 处理表单值变化
  const handleValuesChange = (_changedValues: any, allValues: any) => {
    updateNode(node.id, {
      ...node.data,
      ...allValues
    });
  };

  // 处理模型配置变化
  const handleModelConfigChange = (config: ModelGroup[]) => {
    setModelGroups(config);
    console.log('模型配置已更新:', config);
  };

  // 处理模型选择变化
  const handleModelChange = useCallback((value: string) => {
    setSelectedModelId(value);
    updateNode(node.id, { 
      ...node.data, 
      modelId: value 
    });
    setForceUpdateKey(prev => prev + 1);
    console.log('选择的模型:', value, '节点当前数据:', node.data);
  }, [node.data, updateNode]);

  // 获取当前选择的模型信息
  const getSelectedModelName = () => {
    if (!selectedModelId) return '未选择模型';
    
    for (const group of modelGroups) {
      const model = group.models.find(m => m.id === selectedModelId);
      if (model) {
        return `${model.displayName} (ID: ${model.id})`;
      }
    }
    
    return `${selectedModelId}`;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        modelId: node.data.modelId || '',
        prompt: node.data.prompt || '',
        temperature: node.data.temperature || 0.7,
        maxTokens: node.data.maxTokens || 1024
      }}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="模型">
        <ModelSelector
          key={`model-selector-${forceUpdateKey}`}
          placeholder="请选择模型"
          value={selectedModelId}
          modelType="chat"
          customGroups={modelGroups}
          onChange={handleModelChange}
        />
      </Form.Item>
      
      <Form.Item label="提示词模板">
        <Input.TextArea 
          rows={4} 
          placeholder="输入提示词模板，可以使用 {{参数名}} 引用输入参数"
        />
        {availableParams.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              可用参数: {availableParams.map(param => (
                <Text key={param} code style={{ marginRight: 8 }}>
                  {`{{${param}}}`}
                </Text>
              ))}
            </Text>
          </div>
        )}
        <Alert
          style={{ marginTop: 8 }}
          message="提示词模板支持动态参数"
          description="您可以使用 {{参数名}} 格式引用已连接的输入参数。例如：'请总结以下内容：{{context}}'"
          type="info"
          showIcon
        />
      </Form.Item>
      
      <Form.Item label="温度">
        <Input 
          type="number" 
          placeholder="0.1-1.0"
        />
      </Form.Item>

      <Form.Item label="最大token">
        <Input 
          type="number" 
          placeholder="例如：1000"
        />
      </Form.Item>
    </Form>
  );
};

export default LLMCallNodeForm; 