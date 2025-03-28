import { useState, useEffect, useMemo } from 'react';
import { Select, message, Spin, SelectProps, Space, Typography, Tooltip, Badge } from 'antd';
import { Flexbox } from 'react-layout-kit';
import { getIconByName } from '@/utils/iconutils';
import { getModelList } from '@/services/modelService';
import { Info, Star } from 'lucide-react';
import styles from './ModelSelector.module.css';

const { Text } = Typography;

export interface ModelGroup {
  icon: string;
  name: string;
  description?: string;
  models: ModelInfo[];
}

export interface ModelInfo {
  id: string;
  model: string;
  displayName: string;
  description?: string;
  maxTokens?: number;
  url?: string;
  tags?: string[];
  isFavorite?: boolean;
  lastUsed?: number;
  usageCount?: number;
}

export interface ModelSelectorProps extends Omit<SelectProps<string>, 'options'> {
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  width?: number | string;
  disabled?: boolean;
  modelType?: 'all' | 'chat' | 'embedding' | 'vision' | string;
  groupField?: string;
  configUrl?: string;
  customGroups?: ModelGroup[];
  showDescription?: boolean;
  showIcon?: boolean;
  showFavorites?: boolean;
  showUsageStats?: boolean;
  onFavoriteChange?: (modelId: string, isFavorite: boolean) => void;
  simpleMode?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  style,
  placeholder = '请选择模型',
  width = '100%',
  disabled = false,
  modelType = 'all',
  groupField,
  configUrl,
  customGroups,
  showDescription = true,
  showIcon = true,
  showFavorites = true,
  showUsageStats = true,
  onFavoriteChange,
  simpleMode = false,
  ...rest
}) => {
  const [modelGroups, setModelGroups] = useState<ModelGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [usageStats, setUsageStats] = useState<Record<string, { lastUsed: number; count: number }>>({});

  const loadModelList = async () => {
    if (customGroups && customGroups.length > 0) {
      setModelGroups(customGroups);
      return;
    }

    setLoading(true);
    try {
      const res = await getModelList(configUrl);
      setModelGroups(res.modelProvider || []);
    } catch (error) {
      console.error('获取模型列表失败:', error);
      message.error('获取模型列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelList();
  }, [configUrl, customGroups]);

  const handleChange = (value: string) => {
    onChange?.(value);
    // 更新使用统计
    setUsageStats(prev => ({
      ...prev,
      [value]: {
        lastUsed: Date.now(),
        count: (prev[value]?.count || 0) + 1
      }
    }));
  };

  const handleFavoriteToggle = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (favorites.has(modelId)) {
      newFavorites.delete(modelId);
    } else {
      newFavorites.add(modelId);
    }
    setFavorites(newFavorites);
    onFavoriteChange?.(modelId, !favorites.has(modelId));
  };

  // 根据modelType筛选模型
  const filterModelsByType = (models: ModelInfo[]) => {
    if (modelType === 'all') return models;

    return models.filter(model => {
      if (modelType === 'chat' && (model.tags?.includes('chat') || model.model.includes('gpt'))) {
        return true;
      }
      if (modelType === 'embedding' && (model.tags?.includes('embedding') || model.model.includes('embed'))) {
        return true;
      }
      if (modelType === 'vision' && (model.tags?.includes('vision') || model.model.includes('vision'))) {
        return true;
      }

      if (model.tags?.includes(modelType)) {
        return true;
      }

      return false;
    });
  };

  const renderSimpleOption = (model: ModelInfo) => (
    <span style={{ fontSize: 14 }}>{model.displayName}</span>
  );

  const renderFullOption = (model: ModelInfo) => {
    const stats = usageStats[model.id];

    return (
      <div className={styles.modelOption}>
        <div style={{ flex: 1 }}>
          <Flexbox gap={8}
            horizontal
            align="center">
            <div className={styles.modelName}>{model.displayName}</div>
            <Flexbox gap={8} align="center">
              {model.maxTokens && (
                <Tooltip
                  placement='left'
                  title={`最大 ${model.maxTokens} Tokens`}>
                  <div className={styles.modelTag}>最大 {model.maxTokens} Tokens</div>
                </Tooltip>
              )}
              {showUsageStats && stats && (
                <Tooltip
                  placement='left'
                  title={`使用次数: ${stats.count}`}>
                  <Badge count={stats.count} size="small" />
                </Tooltip>
              )}
            </Flexbox>
          </Flexbox>
          {model.description && (
            <Tooltip title={model.description}>
              <div className={styles.modelDescription}>{model.description}</div>
            </Tooltip>
          )}
        </div>
        {model.url && (
          <Tooltip title="查看详情">
            <a href={model.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
              <Info size={16} />
            </a>
          </Tooltip>
        )}
      </div>
    );
  };

  const options = useMemo(() => {
    return modelGroups.map(group => {
      const filteredModels = filterModelsByType(group.models);
      if (filteredModels.length === 0) return null;

      return {
        label: (
          <Flexbox
            horizontal>
            {showIcon && group.icon && (
              <span className={styles.groupIcon}>
                {getIconByName(group.icon, 20).icon}
              </span>
            )}
            <Text strong>{group.name}</Text>
            {group.description && (
              <Tooltip title={group.description}>
                <Info size={14} style={{ marginLeft: 4 }} />
              </Tooltip>
            )}
          </Flexbox>
        ),
        options: filteredModels.map(model => ({
          label: simpleMode ? renderSimpleOption(model) : renderFullOption(model),
          value: model.id
        }))
      };
    }).filter(Boolean);
  }, [modelGroups, modelType, favorites, usageStats, showFavorites, showUsageStats, simpleMode]);

  if (loading) {
    return (
      <Flexbox align="center" justify="center" style={{ height: 32, width }}>
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
      optionLabelProp="label"
      options={options as any}
      optionFilterProp="children"
      showSearch
      dropdownAlign={{ offset: [-10, 5] }}
      getPopupContainer={(triggerNode) => document.body}
      labelRender={(selectedOption) => {
        const selectedModelId = selectedOption.value;
        let selectedModel: ModelInfo | undefined;
        for (const group of modelGroups) {
          const model = group.models.find(m => m.id === selectedModelId);
          if (model) {
            selectedModel = model;
            break;
          }
        }

        return selectedModel ? (
          <div className={styles.selectedModelName}>
            {selectedModel.displayName}
            {showFavorites && favorites.has(selectedModel.id) && (
              <Star size={16} />
            )}
          </div>
        ) : selectedOption.label;
      }}
      filterOption={(input, option) => {
        if (!option || typeof option.label !== 'object' || !option.label) return false;

        const optionLabel = option.label as React.ReactElement;
        if (!optionLabel.props || !optionLabel.props.children || typeof optionLabel.props.children !== 'object') {
          return false;
        }

        const childrenProps = optionLabel.props.children as React.ReactElement;
        if (!childrenProps.props || !childrenProps.props.children) {
          return false;
        }

        const text = String(childrenProps.props.children).toLowerCase();
        return text.includes(input.toLowerCase());
      }}
      {...rest}
    />
  );
};

export default ModelSelector; 