import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Select, Typography, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { WorkflowNode } from '../../WorkflowDesigner';

const { Text } = Typography;
const { Option } = Select;

interface InputNodeFormProps {
  node: WorkflowNode;
  updateNode: (nodeId: string, data: any) => void;
}

// 可用的数据类型
const DATA_TYPES = [
  { value: 'string', label: '字符串' },
  { value: 'number', label: '数字' },
  { value: 'boolean', label: '布尔值' },
  { value: 'array', label: '数组' },
  { value: 'object', label: '对象' },
  { value: 'any', label: '任意类型' },
];

const InputNodeForm: React.FC<InputNodeFormProps> = ({ node, updateNode }) => {
  const [form] = Form.useForm();
  const [parameters, setParameters] = useState<{name: string, type: string}[]>([]);

  // 初始化参数列表
  useEffect(() => {
    if (node?.data?.outputs) {
      const outputs = node.data.outputs;
      const params = Object.entries(outputs).map(([name, type]) => ({
        name,
        type: type as string
      }));
      
      // 确保至少有一个参数
      if (params.length === 0) {
        params.push({ name: 'output', type: 'any' });
      }
      
      setParameters(params);
    } else {
      // 默认参数
      setParameters([{ name: 'output', type: 'any' }]);
    }
  }, [node?.data?.outputs]);

  // 当参数变化时，更新节点数据
  const updateNodeData = (newParams: {name: string, type: string}[]) => {
    const outputs: Record<string, string> = {};
    
    newParams.forEach(param => {
      if (param.name.trim() !== '') {
        outputs[param.name] = param.type;
      }
    });
    
    updateNode(node.id, {
      ...node.data,
      outputs
    });
  };

  // 添加新参数
  const addParameter = () => {
    const newParams = [...parameters, { name: '', type: 'string' }];
    setParameters(newParams);
    updateNodeData(newParams);
  };

  // 删除参数
  const removeParameter = (index: number) => {
    // 保证至少有一个参数
    if (parameters.length <= 1) {
      return;
    }
    
    const newParams = parameters.filter((_, i) => i !== index);
    setParameters(newParams);
    updateNodeData(newParams);
  };

  // 参数变化处理
  const handleParameterChange = (index: number, field: 'name' | 'type', value: string) => {
    const newParams = [...parameters];
    newParams[index][field] = value;
    
    // 如果是名称变化，确保名称唯一
    if (field === 'name') {
      // 清除空格
      value = value.trim();
      
      // 检查重复名称
      const nameCount = newParams.filter(p => p.name === value).length;
      if (nameCount > 1) {
        // 如果有重复，添加序号后缀
        newParams[index].name = `${value}_${index}`;
      }
    }
    
    setParameters(newParams);
    updateNodeData(newParams);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ parameters }}
    >
      <Text>自定义输入参数</Text>
      <Divider />
      
      {parameters.map((param, index) => (
        <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
          <Form.Item
            label={index === 0 ? "参数名称" : ""}
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="参数名称"
              value={param.name}
              onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            label={index === 0 ? "数据类型" : ""}
            style={{ marginBottom: 0 }}
          >
            <Select
              value={param.type}
              style={{ width: 120 }}
              onChange={(value) => handleParameterChange(index, 'type', value)}
            >
              {DATA_TYPES.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => removeParameter(index)}
              disabled={parameters.length <= 1}
              danger
            />
          </Form.Item>
        </Space>
      ))}
      
      <Form.Item>
        <Button 
          type="dashed" 
          onClick={addParameter} 
          block 
          icon={<PlusOutlined />}
        >
          添加参数
        </Button>
      </Form.Item>
      
      <Text type="secondary">
        注意：这些参数将作为工作流的输入参数，可在工作流执行时传入
      </Text>
    </Form>
  );
};

export default InputNodeForm; 