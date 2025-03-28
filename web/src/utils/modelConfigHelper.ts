import { ModelGroup, ModelInfo } from '@/components/ModelSelector';
import { defaultModelGroups } from '@/config/defaultModels';

/**
 * 从本地存储获取模型配置
 * @returns 模型配置数组
 */
export const getLocalModelConfig = (): ModelGroup[] => {
  try {
    const configString = localStorage.getItem('modelConfig');
    if (configString) {
      return JSON.parse(configString);
    }
  } catch (error) {
    console.error('从本地存储获取模型配置失败:', error);
  }
  
  // 返回默认模型配置
  return JSON.parse(JSON.stringify(defaultModelGroups));
};

/**
 * 保存模型配置到本地存储
 * @param config 模型配置数组
 */
export const saveLocalModelConfig = (config: ModelGroup[]): void => {
  try {
    localStorage.setItem('modelConfig', JSON.stringify(config));
  } catch (error) {
    console.error('保存模型配置到本地存储失败:', error);
  }
};

/**
 * 初始化模型配置
 * 如果本地存储中没有模型配置，则使用默认配置
 */
export const initModelConfig = (): ModelGroup[] => {
  try {
    const configString = localStorage.getItem('modelConfig');
    if (!configString) {
      saveLocalModelConfig(defaultModelGroups);
      return defaultModelGroups;
    }
    return JSON.parse(configString);
  } catch (error) {
    console.error('初始化模型配置失败:', error);
    return defaultModelGroups;
  }
};

/**
 * 添加自定义模型到配置
 * @param groupName 模型组名称
 * @param model 模型信息
 */
export const addCustomModel = (groupName: string, model: ModelInfo): ModelGroup[] => {
  const config = getLocalModelConfig();
  
  // 查找指定的模型组
  const groupIndex = config.findIndex(group => group.name === groupName);
  
  if (groupIndex >= 0) {
    // 如果模型组存在，检查模型是否已存在
    const modelExists = config[groupIndex].models.some(m => m.id === model.id);
    
    if (!modelExists) {
      // 添加模型到现有组
      config[groupIndex].models.push(model);
    } else {
      // 如果已存在，则更新模型信息
      const modelIndex = config[groupIndex].models.findIndex(m => m.id === model.id);
      config[groupIndex].models[modelIndex] = {...model};
    }
  } else {
    // 如果模型组不存在，创建新组
    config.push({
      icon: 'model',
      name: groupName,
      models: [model]
    });
  }
  
  // 保存配置
  saveLocalModelConfig(config);
  return config;
};

/**
 * 删除自定义模型
 * @param modelId 要删除的模型ID
 */
export const removeCustomModel = (modelId: string): ModelGroup[] => {
  const config = getLocalModelConfig();
  
  // 遍历所有模型组，查找并删除指定的模型
  const updatedConfig = config.map(group => ({
    ...group,
    models: group.models.filter(model => model.id !== modelId)
  }));
  
  // 移除空模型组
  const filteredConfig = updatedConfig.filter(group => group.models.length > 0);
  
  // 保存配置
  saveLocalModelConfig(filteredConfig);
  return filteredConfig;
};

/**
 * 获取模型信息
 * @param modelId 模型ID
 * @param modelGroups 模型组数组
 * @returns 模型信息或undefined
 */
export const getModelInfo = (modelId: string, modelGroups: ModelGroup[]): ModelInfo | undefined => {
  for (const group of modelGroups) {
    const model = group.models.find(m => m.id === modelId);
    if (model) {
      return model;
    }
  }
  return undefined;
};

/**
 * 格式化模型名称显示
 * @param modelId 模型ID
 * @returns 格式化后的模型名称
 */
export const formatModelName = (modelId: string): string => {
  return modelId
    .split(/[-_.]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}; 