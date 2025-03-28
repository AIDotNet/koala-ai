import React, { useState } from 'react';
import { Card, Input, Form, Button, Space, Typography, Slider, Divider } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import ModelSelector from './ModelSelector';
import styles from './ModelComponents.module.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

export interface LLMCallNodeProps {
  nodeId: string;
  data: {
    prompt?: string;
    modelId?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    outputs?: {
      output: string;
    };
  };
  onDataChange: (nodeId: string, data: any) => void;
  onRunNode?: (nodeId: string) => void;
  onViewLogs?: (nodeId: string) => void;
}

export const LLMCallNode: React.FC<LLMCallNodeProps> = ({
  nodeId,
  data,
  onDataChange,
  onRunNode,
  onViewLogs
}) => {
  const [form] = Form.useForm();
  const [expandSettings, setExpandSettings] = useState(false);

  // 处理表单值变化
  const handleValuesChange = (_changedValues: any, allValues: any) => {
    onDataChange(nodeId, {
      ...data,
      ...allValues
    });
  };

  // 初始化表单值
  const initialValues = {
    prompt: data.prompt || '',
    modelId: data.modelId || '',
    temperature: data.temperature || 0.7,
    maxTokens: data.maxTokens || 1024,
    topP: data.topP || 1.0,
    presencePenalty: data.presencePenalty || 0,
    frequencyPenalty: data.frequencyPenalty || 0
  };

  const handleRunNode = () => {
    onRunNode?.(nodeId);
  };

  const handleViewLogs = () => {
    onViewLogs?.(nodeId);
  };

  return (
    <Card 
      className={styles.llmCallNode}
      title={
        <Flexbox horizontal align="center" gap={8}>
          <Brain size={18} />
          <Title level={5} style={{ margin: 0 }}>LLM调用</Title>
        </Flexbox>
      }
      bodyStyle={{ padding: '12px' }}
      bordered={false}
    >
      <Form 
        form={form}
        layout="vertical" 
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        <Form.Item 
          name="modelId" 
          label="模型"
          rules={[{ required: true, message: '请选择模型' }]}
        >
          <ModelSelector placeholder="请选择模型" modelType="chat" />
        </Form.Item>
        
        <Form.Item 
          name="prompt" 
          label="提示词"
          rules={[{ required: true, message: '请输入提示词' }]}
        >
          <TextArea 
            placeholder="请输入提示词..." 
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
        
        <div 
          className={styles.advancedSettingsHeader}
          onClick={() => setExpandSettings(!expandSettings)}
        >
          <Text type="secondary">高级设置</Text>
          {expandSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        
        {expandSettings && (
          <div className={styles.advancedSettingsContent}>
            <div className={styles.parameterItem}>
              <div className={styles.parameterLabel}>温度</div>
              <div className={styles.parameterControl}>
                <Form.Item name="temperature" noStyle>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    tooltip={{ formatter: (value) => value?.toFixed(1) }}
                  />
                </Form.Item>
              </div>
            </div>
            
            <div className={styles.parameterItem}>
              <div className={styles.parameterLabel}>最大长度</div>
              <div className={styles.parameterControl}>
                <Form.Item name="maxTokens" noStyle>
                  <Input type="number" min={1} max={32000} />
                </Form.Item>
              </div>
            </div>
            
            <div className={styles.parameterItem}>
              <div className={styles.parameterLabel}>Top P</div>
              <div className={styles.parameterControl}>
                <Form.Item name="topP" noStyle>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    tooltip={{ formatter: (value) => value?.toFixed(2) }}
                  />
                </Form.Item>
              </div>
            </div>
            
            <div className={styles.parameterItem}>
              <div className={styles.parameterLabel}>频率惩罚</div>
              <div className={styles.parameterControl}>
                <Form.Item name="frequencyPenalty" noStyle>
                  <Slider
                    min={-2}
                    max={2}
                    step={0.1}
                    tooltip={{ formatter: (value) => value?.toFixed(1) }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        )}
        
        {data.outputs?.output && (
          <div className={styles.outputSection}>
            <Divider plain style={{ margin: '12px 0 8px' }}>输出结果</Divider>
            <div className={styles.outputContent}>
              {data.outputs.output}
            </div>
          </div>
        )}
        
        <Space style={{ marginTop: 12 }}>
          <Button type="primary" size="small" onClick={handleRunNode}>试运行</Button>
          <Button size="small" onClick={handleViewLogs}>查看日志</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default LLMCallNode; 