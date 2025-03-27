namespace Koala.Domain.WorkFlows.Enums;

/// <summary>
/// 工作流实例状态枚举
/// </summary>
public enum WorkflowInstanceStatusEnum
{
    /// <summary>
    /// 运行中
    /// </summary>
    Running = 0,
    
    /// <summary>
    /// 已完成
    /// </summary>
    Completed = 1,
    
    /// <summary>
    /// 已暂停
    /// </summary>
    Suspended = 2,
    
    /// <summary>
    /// 失败
    /// </summary>
    Failed = 3,
    
    /// <summary>
    /// 已取消
    /// </summary>
    Cancelled = 4
} 