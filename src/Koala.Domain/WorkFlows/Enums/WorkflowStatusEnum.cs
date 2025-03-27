namespace Koala.Domain.WorkFlows.Enums;

/// <summary>
/// 工作流状态枚举
/// </summary>
public enum WorkflowStatusEnum
{
    /// <summary>
    /// 草稿
    /// </summary>
    Draft = 0,
    
    /// <summary>
    /// 已发布
    /// </summary>
    Published = 1,
    
    /// <summary>
    /// 已归档
    /// </summary>
    Archived = 2,
    
    /// <summary>
    /// 已删除
    /// </summary>
    Deleted = 3
} 