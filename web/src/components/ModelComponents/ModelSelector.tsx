import { getModelList } from '@/services/modelService';
import { Select, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Tooltip } from 'antd';
import { getIconByName } from '@/utils/iconutils';
import styles from './ModelComponents.module.css';

export interface ModelSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  width?: number | string;
  disabled?: boolean;
  modelType?: 'all' | 'chat' | 'embedding';
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  style,
  placeholder = '请选择模型',
  width = '100%',
  disabled = false,
  modelType = 'all'
}) => {
  const [modelList, setModelList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadModelList = async () => {
    setLoading(true);
    try {
      const res = await getModelList();
      setModelList(res.modelProvider || []);
    } catch (error) {
      message.error('获取模型列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadModelList();
  }, []);

  const handleChange = (value: string) => {
    onChange?.(value);
  };

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ height: 32 }}>
        <Spin size="small" />
      </Flexbox>
    );
  }

  return (
    <Select
      value={value}
      onChange={handleChange}
      style={{ width, ...style }}
      placeholder={placeholder}
      disabled={disabled}
      className={styles.modelSelector}
      popupClassName={styles.modelDropdown}
      options={modelList.map((model) => {
        return {
          label: (
            <Tooltip title={model.description}>
              <Flexbox style={{ gap: 4, margin: 5 }} horizontal>
                {getIconByName(model.icon, 24).icon}
                <span style={{ marginLeft: 8, fontSize: 14 }}>{model.name}</span>
              </Flexbox>
            </Tooltip>
          ),
          title: model.name,
          options: model.models
            .filter((item: any) => {
              if (modelType === 'all') return true;
              // 这里可以根据模型类型进行过滤，例如根据特定属性
              return true;
            })
            .map((item: any) => {
              return {
                label: (
                  <span style={{ fontSize: 14 }}>{item.displayName}</span>
                ),
                value: item.id
              };
            })
        };
      })}
    />
  );
};

export default ModelSelector; 