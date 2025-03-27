namespace Koala.Domain.WorkFlows.Enums;

/// <summary>
/// 连接类型枚举
/// </summary>
public enum ConnectionTypeEnum
{
    /// <summary>
    /// 默认连接
    /// </summary>
    Default = 0,
    
    /// <summary>
    /// 条件连接（是）
    /// </summary>
    ConditionYes = 1,
    
    /// <summary>
    /// 条件连接（否）
    /// </summary>
    ConditionNo = 2,
    
    /// <summary>
    /// 错误处理连接
    /// </summary>
    Error = 3
} 