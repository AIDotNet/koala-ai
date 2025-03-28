import { get } from "@/utils/request";

/**
 * 获取模型列表
 * @param configUrl 自定义配置URL，默认使用预设路径
 * @returns 返回模型提供商和模型列表
 */
const getModelList = (configUrl?: string) => {
  return get(configUrl || '/config/model.json');
};

export { getModelList };
