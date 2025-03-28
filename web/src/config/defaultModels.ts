import { ModelGroup } from '@/components/ModelSelector';

// 默认模型配置
export const defaultModelGroups: ModelGroup[] = [
  {
    name: "OpenAI",
    icon: "openai",
    description: "OpenAI官方模型",
    models: [
      {
        id: "gpt-4o",
        model: "gpt-4o",
        displayName: "GPT-4o",
        description: "OpenAI最新多模态模型，支持图像和文本输入",
        maxTokens: 128000,
        tags: ["chat", "vision"]
      },
      {
        id: "gpt-4-turbo",
        model: "gpt-4-turbo",
        displayName: "GPT-4 Turbo",
        description: "OpenAI的GPT-4高性能版本",
        maxTokens: 128000,
        tags: ["chat"]
      },
      {
        id: "gpt-4",
        model: "gpt-4",
        displayName: "GPT-4",
        description: "OpenAI的高级大语言模型",
        maxTokens: 8192,
        tags: ["chat"]
      },
      {
        id: "gpt-3.5-turbo",
        model: "gpt-3.5-turbo",
        displayName: "GPT-3.5 Turbo",
        description: "更快速、更经济的模型",
        maxTokens: 16385,
        tags: ["chat"]
      }
    ]
  },
  {
    name: "Anthropic",
    icon: "anthropic",
    description: "Anthropic Claude系列模型",
    models: [
      {
        id: "claude-3-opus",
        model: "claude-3-opus",
        displayName: "Claude 3 Opus",
        description: "Anthropic最强大的模型，适用于高复杂度任务",
        maxTokens: 200000,
        tags: ["chat", "vision"]
      },
      {
        id: "claude-3-sonnet",
        model: "claude-3-sonnet",
        displayName: "Claude 3 Sonnet",
        description: "平衡性能和速度的模型",
        maxTokens: 200000,
        tags: ["chat", "vision"]
      },
      {
        id: "claude-3-haiku",
        model: "claude-3-haiku",
        displayName: "Claude 3 Haiku",
        description: "快速、高效、经济的模型",
        maxTokens: 200000,
        tags: ["chat", "vision"]
      }
    ]
  },
  {
    name: "开源模型",
    icon: "github",
    description: "常用开源大语言模型",
    models: [
      {
        id: "llama-3-70b",
        model: "llama-3-70b",
        displayName: "Llama 3 (70B)",
        description: "Meta最新的开源大语言模型",
        maxTokens: 8192,
        tags: ["chat"]
      },
      {
        id: "mixtral-8x7b",
        model: "mixtral-8x7b",
        displayName: "Mixtral 8x7B",
        description: "Mistral AI的混合专家模型",
        maxTokens: 32768,
        tags: ["chat"]
      },
      {
        id: "qwen-72b",
        model: "qwen-72b",
        displayName: "Qwen 72B",
        description: "阿里巴巴的通义千问开源大模型",
        maxTokens: 8192,
        tags: ["chat"]
      }
    ]
  },
  {
    name: "嵌入模型",
    icon: "embedding",
    description: "文本嵌入模型",
    models: [
      {
        id: "text-embedding-3-large",
        model: "text-embedding-3-large",
        displayName: "OpenAI Embedding Large",
        description: "OpenAI高性能文本嵌入模型",
        maxTokens: 8191,
        tags: ["embedding"]
      },
      {
        id: "text-embedding-3-small",
        model: "text-embedding-3-small",
        displayName: "OpenAI Embedding Small",
        description: "OpenAI轻量级文本嵌入模型",
        maxTokens: 8191,
        tags: ["embedding"]
      },
      {
        id: "bge-large-zh",
        model: "bge-large-zh",
        displayName: "BGE Large (中文)",
        description: "中文文本嵌入开源模型",
        maxTokens: 512,
        tags: ["embedding"]
      }
    ]
  }
];

// 获取默认模型配置
export const getDefaultModelGroups = (): ModelGroup[] => {
  return JSON.parse(JSON.stringify(defaultModelGroups));
};

// 初始化本地存储中的模型配置
export const initializeModelConfig = (): void => {
  try {
    const configString = localStorage.getItem('modelConfig');
    if (!configString) {
      localStorage.setItem('modelConfig', JSON.stringify(defaultModelGroups));
    }
  } catch (error) {
    console.error('初始化模型配置失败:', error);
  }
}; 