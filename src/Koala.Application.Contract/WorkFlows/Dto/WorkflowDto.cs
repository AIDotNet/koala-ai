using Koala.Core.Model;
using Koala.Domain.WorkFlows.Enums;

namespace Koala.Application.Contract.WorkFlows.Dto;

public class WorkflowDto : AuditEntityDto<long>
{
    /// <summary>
    /// 工作流名称
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// 工作流描述
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// 工作流版本
    /// </summary>
    public int Version { get; set; } = 1;

    /// <summary>
    /// 工作流状态
    /// </summary>
    public WorkflowStatusEnum Status { get; set; } = WorkflowStatusEnum.Draft;

    /// <summary>
    /// 工作流定义（JSON格式）
    /// </summary>
    public string Definition { get; set; } = null!;

    /// <summary>
    /// 关联的智能体ID（可为空）
    /// </summary>
    public long? AgentId { get; set; }

    /// <summary>
    /// 工作空间ID
    /// </summary>
    public long WorkspaceId { get; set; }

    /// <summary>
    /// 标签（JSON数组格式，可为空）
    /// </summary>
    public string? Tags { get; set; }
}