using Koala.Core.Model;
using Koala.Domain.WorkFlows.Enums;

namespace Koala.Application.Contract.WorkFlows.Dto;

public class WorkflowInstanceDto : AuditEntityDto<long>
{
    /// <summary>
    /// 实例参考ID（用于外部系统关联）
    /// </summary>
    public string ReferenceId { get;  set; } = null!;

    /// <summary>
    /// 工作流ID
    /// </summary>
    public long WorkflowId { get;  set; }

    /// <summary>
    /// 工作流版本号（记录创建时的工作流版本）
    /// </summary>
    public int WorkflowVersion { get;  set; }

    /// <summary>
    /// 实例状态
    /// </summary>
    public WorkflowInstanceStatusEnum Status { get;  set; } = WorkflowInstanceStatusEnum.Running;

    /// <summary>
    /// 实例数据（JSON格式）
    /// </summary>
    public string? Data { get;  set; }

    /// <summary>
    /// 当前活动节点ID
    /// </summary>
    public string? CurrentNodeId { get;  set; }

    /// <summary>
    /// 开始时间
    /// </summary>
    public DateTimeOffset StartTime { get;  set; }

    /// <summary>
    /// 结束时间
    /// </summary>
    public DateTimeOffset? EndTime { get;  set; }

    /// <summary>
    /// 错误信息
    /// </summary>
    public string? ErrorMessage { get;  set; }

    /// <summary>
    /// Workflow Core实例ID
    /// </summary>
    public string? WorkflowCoreInstanceId { get;  set; }

    /// <summary>
    /// 导航属性 - 工作流
    /// </summary>
    public WorkflowDto? Workflow { get;  set; }
}