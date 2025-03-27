namespace Koala.Domain.WorkFlows.Enums;

/// <summary>
/// 节点类型枚举
/// </summary>
public enum NodeTypeEnum
{
    /// <summary>
    /// 开始节点
    /// </summary>
    Start = 0,
    
    /// <summary>
    /// 条件选择器节点
    /// </summary>
    Selector = 1,
    
    /// <summary>
    /// LLM调用节点
    /// </summary>
    LlmCall = 2,
    
    /// <summary>
    /// 知识库查询节点
    /// </summary>
    KnowledgeQuery = 3,
    
    /// <summary>
    /// 图像处理节点
    /// </summary>
    ImageProcessing = 4,
    
    /// <summary>
    /// 语音转文本节点
    /// </summary>
    SpeechToText = 5,
    
    /// <summary>
    /// 循环节点
    /// </summary>
    Loop = 6,
    
    /// <summary>
    /// 变量聚合节点
    /// </summary>
    Aggregation = 7,
    
    /// <summary>
    /// 输入节点
    /// </summary>
    Input = 8,
    
    /// <summary>
    /// 输出节点
    /// </summary>
    Output = 9,
    
    /// <summary>
    /// 自定义代码节点
    /// </summary>
    CustomCode = 10,
    
    /// <summary>
    /// 结束节点
    /// </summary>
    End = 11
} 