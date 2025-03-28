import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Form, Input, Tag, Tooltip, message, Modal, Select, Radio, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import { ModelGroup, ModelInfo } from '@/components/ModelSelector';
import { getLocalModelConfig, addCustomModel, removeCustomModel } from '@/utils/modelConfigHelper';
import styles from './index.module.css';

const EditableCell = ({ editing, dataIndex, title, record, index, children, ...restProps }: any) => {
  const inputNode = dataIndex === 'tags' ? (
    <Input placeholder="多个标签用逗号分隔" />
  ) : dataIndex === 'maxTokens' ? (
    <Input type="number" placeholder="例如: 4096, 32000等" />
  ) : dataIndex === 'description' ? (
    <Input.TextArea placeholder="模型的描述信息" />
  ) : (
    <Input placeholder={`请输入${title}`} />
  );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: ['groupName', 'id', 'displayName'].includes(dataIndex),
              message: `请输入${title}`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// 模型模板类型定义
interface ModelTemplate {
  groupName: string;
  id: string;
  displayName: string;
  description: string;
  maxTokens: string;
  tags: string;
}

type ModelTemplateKey = 'custom' | 'gpt4' | 'gpt35turbo' | 'claude3opus' | 'claude3sonnet' | 'gemini15pro';

const ModelPage: React.FC = () => {
  const [modelGroups, setModelGroups] = useState<ModelGroup[]>([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalForm] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState<ModelTemplateKey>('custom');

  // 预定义的模型模板
  const modelTemplates: Record<ModelTemplateKey, ModelTemplate> = {
    custom: {
      groupName: '',
      id: '',
      displayName: '',
      description: '',
      maxTokens: '',
      tags: ''
    },
    gpt4: {
      groupName: 'OpenAI',
      id: 'gpt-4',
      displayName: 'GPT-4',
      description: 'OpenAI的GPT-4模型，具有强大的理解和生成能力',
      maxTokens: '8192',
      tags: 'AI,文本生成,对话'
    },
    gpt35turbo: {
      groupName: 'OpenAI',
      id: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      description: 'OpenAI的GPT-3.5 Turbo模型，平衡了性能和成本',
      maxTokens: '4096',
      tags: 'AI,文本生成,对话,经济'
    },
    claude3opus: {
      groupName: 'Anthropic',
      id: 'claude-3-opus',
      displayName: 'Claude 3 Opus',
      description: 'Anthropic的Claude 3 Opus模型，具有出色的推理和创意能力',
      maxTokens: '200000',
      tags: 'AI,文本生成,推理,创意'
    },
    claude3sonnet: {
      groupName: 'Anthropic',
      id: 'claude-3-sonnet',
      displayName: 'Claude 3 Sonnet',
      description: 'Anthropic的Claude 3 Sonnet模型，性能和成本的平衡选择',
      maxTokens: '180000',
      tags: 'AI,文本生成,推理'
    },
    gemini15pro: {
      groupName: 'Google',
      id: 'gemini-1.5-pro',
      displayName: 'Gemini 1.5 Pro',
      description: 'Google的Gemini 1.5 Pro模型，具有强大的多模态能力',
      maxTokens: '1000000',
      tags: 'AI,文本生成,多模态,长上下文'
    }
  };

  // 加载模型配置
  useEffect(() => {
    const config = getLocalModelConfig();
    setModelGroups(config);
  }, []);

  const isEditing = (record: ModelInfo) => record.id === editingKey;

  const edit = (record: ModelInfo) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: string) => {
    try {
      setLoading(true);
      const row = await form.validateFields();
      const newData = [...modelGroups];
      const groupIndex = newData.findIndex(group => 
        group.models.some(model => model.id === id)
      );
      
      if (groupIndex > -1) {
        const modelIndex = newData[groupIndex].models.findIndex(model => model.id === id);
        if (modelIndex > -1) {
          const updatedModel = {
            ...newData[groupIndex].models[modelIndex],
            ...row,
            tags: row.tags?.split(',').map((tag: string) => tag.trim()) || []
          };
          newData[groupIndex].models[modelIndex] = updatedModel;
          setModelGroups(newData);
          message.success('保存成功');
          setEditingKey('');
        }
      }
    } catch (errInfo) {
      console.error('保存失败:', errInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async () => {
    try {
      setLoading(true);
      const values = await modalForm.validateFields();
      const { groupName, id, displayName, description } = values;
      
      const newModel: ModelInfo = {
        id,
        model: id,
        displayName,
        description,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()) || []
      };
      
      if (values.maxTokens) {
        newModel.maxTokens = parseInt(values.maxTokens);
      }
      
      const updatedConfig = addCustomModel(groupName, newModel);
      setModelGroups(updatedConfig);
      message.success('模型添加成功');
      modalForm.resetFields();
      setModalVisible(false);
    } catch (error) {
      console.error('添加模型失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    modalForm.resetFields();
    setSelectedTemplate('custom');
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    modalForm.resetFields();
    setModalVisible(false);
  };

  const handleTemplateChange = (value: ModelTemplateKey) => {
    setSelectedTemplate(value);
    modalForm.setFieldsValue(modelTemplates[value]);
  };

  const handleDeleteModel = async (modelId: string) => {
    try {
      setLoading(true);
      const updatedConfig = removeCustomModel(modelId);
      setModelGroups(updatedConfig);
      message.success('模型删除成功');
    } catch (error) {
      console.error('删除模型失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '分组',
      dataIndex: 'groupName',
      key: 'groupName',
      editable: true,
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      )
    },
    {
      title: '模型ID',
      dataIndex: 'id',
      key: 'id',
      editable: true,
      render: (text: string) => (
        <Tooltip title="模型的唯一标识符">
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      editable: true,
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      editable: true,
      render: (tags: string[]) => (
        <Space wrap>
          {tags?.map(tag => (
            <Tag key={tag} color="green">{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '最大Token数',
      dataIndex: 'maxTokens',
      key: 'maxTokens',
      editable: true,
      render: (maxTokens: number) => maxTokens || '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ModelInfo) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="text"
              icon={<SaveOutlined />}
              onClick={() => save(record.id)}
              loading={loading}
            >
              保存
            </Button>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={cancel}
            >
              取消
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
            >
              编辑
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteModel(record.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ModelInfo) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // 将层级结构的模型数据扁平化为表格数据
  const getTableData = () => {
    return modelGroups.flatMap(group => {
      return group.models.map(model => ({
        ...model,
        groupName: group.name,
        key: model.id
      }));
    });
  };

  return (
    <div className={styles.container}>
      <Card 
        title="模型配置管理"
        className={styles.card}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showAddModal}
          >
            添加模型
          </Button>
        }
      >
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={getTableData()}
            pagination={false}
            loading={loading}
            scroll={{ x: true }}
          />
        </Form>

        <Modal
          title="添加新模型"
          open={modalVisible}
          onOk={handleAddModel}
          onCancel={handleModalCancel}
          confirmLoading={loading}
          width={700}
        >
          <Form
            form={modalForm}
            layout="vertical"
            initialValues={modelTemplates.custom}
          >
            <Form.Item label="选择模型模板">
              <Row gutter={[16, 16]} className={styles.templateCards}>
                <Col span={8}>
                  <Card 
                    hoverable
                    className={`${styles.templateCard} ${selectedTemplate === 'custom' ? styles.selectedCard : ''}`}
                    onClick={() => handleTemplateChange('custom')}
                  >
                    <div className={styles.templateCardContent}>
                      <RobotOutlined className={styles.templateIcon} />
                      <div className={styles.templateName}>自定义模型</div>
                      <div className={styles.templateDesc}>创建完全自定义的模型配置</div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    hoverable
                    className={`${styles.templateCard} ${selectedTemplate === 'gpt4' ? styles.selectedCard : ''}`}
                    onClick={() => handleTemplateChange('gpt4')}
                  >
                    <div className={styles.templateCardContent}>
                      <RobotOutlined className={styles.templateIcon} />
                      <div className={styles.templateName}>GPT-4</div>
                      <div className={styles.templateDesc}>OpenAI强大的大语言模型</div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    hoverable
                    className={`${styles.templateCard} ${selectedTemplate === 'gpt35turbo' ? styles.selectedCard : ''}`}
                    onClick={() => handleTemplateChange('gpt35turbo')}
                  >
                    <div className={styles.templateCardContent}>
                      <RobotOutlined className={styles.templateIcon} />
                      <div className={styles.templateName}>GPT-3.5 Turbo</div>
                      <div className={styles.templateDesc}>经济实惠的OpenAI模型</div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    hoverable
                    className={`${styles.templateCard} ${selectedTemplate === 'claude3opus' ? styles.selectedCard : ''}`}
                    onClick={() => handleTemplateChange('claude3opus')}
                  >
                    <div className={styles.templateCardContent}>
                      <RobotOutlined className={styles.templateIcon} />
                      <div className={styles.templateName}>Claude 3 Opus</div>
                      <div className={styles.templateDesc}>Anthropic高端推理模型</div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    hoverable
                    className={`${styles.templateCard} ${selectedTemplate === 'claude3sonnet' ? styles.selectedCard : ''}`}
                    onClick={() => handleTemplateChange('claude3sonnet')}
                  >
                    <div className={styles.templateCardContent}>
                      <RobotOutlined className={styles.templateIcon} />
                      <div className={styles.templateName}>Claude 3 Sonnet</div>
                      <div className={styles.templateDesc}>Anthropic平衡型模型</div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card 
                    hoverable
                    className={`${styles.templateCard} ${selectedTemplate === 'gemini15pro' ? styles.selectedCard : ''}`}
                    onClick={() => handleTemplateChange('gemini15pro')}
                  >
                    <div className={styles.templateCardContent}>
                      <RobotOutlined className={styles.templateIcon} />
                      <div className={styles.templateName}>Gemini 1.5 Pro</div>
                      <div className={styles.templateDesc}>Google支持长上下文的模型</div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Form.Item>
            
            <Form.Item
              name="groupName"
              label="模型分组"
              rules={[{ required: true, message: '请输入模型分组名称' }]}
            >
              <Input placeholder="模型分组" />
            </Form.Item>
            <Form.Item
              name="id"
              label="模型ID"
              rules={[{ required: true, message: '请输入模型ID' }]}
            >
              <Input placeholder="模型ID" />
            </Form.Item>
            <Form.Item
              name="displayName"
              label="显示名称"
              rules={[{ required: true, message: '请输入显示名称' }]}
            >
              <Input placeholder="显示名称" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="模型的描述信息" rows={4} />
            </Form.Item>
            <Form.Item
              name="maxTokens"
              label="最大Token数"
            >
              <Input type="number" placeholder="例如: 4096, 32000等" />
            </Form.Item>
            <Form.Item
              name="tags"
              label="标签"
            >
              <Input placeholder="多个标签用逗号分隔" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ModelPage; 