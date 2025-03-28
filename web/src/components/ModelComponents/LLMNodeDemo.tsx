import React, { useState } from 'react';
import { Card, Typography, Button, Space, message } from 'antd';
import { Flexbox } from 'react-layout-kit';
import LLMCallNode from './LLMCallNode';

const { Title, Paragraph } = Typography;

const LLMNodeDemo: React.FC = () => {
  const [nodeData, setNodeData] = useState({
    prompt: '请用中文解释什么是大语言模型',
    modelId: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1024,
    outputs: {
      output: ''
    }
  });

  const handleDataChange = (_nodeId: string, data: any) => {
    setNodeData({
      ...nodeData,
      ...data
    });
  };

  const handleRunNode = () => {
    // 模拟运行节点
    if (!nodeData.prompt) {
      message.error('请输入提示词');
      return;
    }

    if (!nodeData.modelId) {
      message.error('请选择模型');
      return;
    }

    message.loading('正在生成...', 2);
    
    // 模拟API调用延迟
    setTimeout(() => {
      setNodeData({
        ...nodeData,
        outputs: {
          output: `大语言模型(Large Language Model，简称LLM)是一种基于深度学习的自然语言处理模型，通过大规模文本数据训练而成。它能够理解、生成和转换人类语言，实现各种语言任务，如文本生成、翻译、问答等。

典型特点：
1. 规模庞大：通常包含数十亿至数千亿参数
2. 自监督学习：主要通过预测下一个词进行训练
3. 涌现能力：随着规模增大，展现出许多意想不到的能力
4. 上下文学习：能够从对话中学习并调整响应

代表模型有OpenAI的GPT系列、Google的PaLM/Gemini、Anthropic的Claude等。`
        }
      });
      message.success('生成完成');
    }, 2000);
  };

  const handleViewLogs = () => {
    message.info('查看节点运行日志');
  };

  const handleReset = () => {
    setNodeData({
      prompt: '',
      modelId: '',
      temperature: 0.7,
      maxTokens: 1024,
      outputs: {
        output: ''
      }
    });
    message.success('已重置');
  };

  return (
    <Card title="LLM调用节点示例" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Flexbox gap={16}>
        <Paragraph>
          这是一个LLM调用节点的示例，展示了如何在工作流中使用大语言模型。您可以选择模型、输入提示词，并调整参数来生成内容。
        </Paragraph>
        
        <Flexbox horizontal align="flex-start" gap={24}>
          <div style={{ width: 320 }}>
            <LLMCallNode
              nodeId="demo-node"
              data={nodeData}
              onDataChange={handleDataChange}
              onRunNode={handleRunNode}
              onViewLogs={handleViewLogs}
            />
          </div>
          
          <Flexbox flex={1}>
            <Title level={4}>使用说明</Title>
            <Paragraph>
              1. 选择需要使用的大语言模型
            </Paragraph>
            <Paragraph>
              2. 输入提示词内容
            </Paragraph>
            <Paragraph>
              3. 可选择展开"高级设置"来调整生成参数
            </Paragraph>
            <Paragraph>
              4. 点击"试运行"按钮来测试节点效果
            </Paragraph>
            <Paragraph>
              5. 点击"查看日志"可以查看节点的运行历史记录
            </Paragraph>
            
            <Button type="primary" onClick={handleReset} style={{ marginTop: 16 }}>
              重置演示
            </Button>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </Card>
  );
};

export default LLMNodeDemo; 