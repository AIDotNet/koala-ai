using System;

namespace Koala.Application.Contract.WorkFlows.Dto;

/// <summary>
/// 创建工作流请求DTO
/// </summary>
public class CreateWorkflowDto
{
    /// <summary>
    /// 工作流名称
    /// </summary>
    public required string Name { get; set; }
    
    /// <summary>
    /// 工作流定义 (JSON格式)
    /// </summary>
    public required string Definition { get; set; }
    
    /// <summary>
    /// 工作空间ID
    /// </summary>
    public required long WorkspaceId { get; set; }
    
    /// <summary>
    /// 工作流描述
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// 标签（逗号分隔）
    /// </summary>
    public string? Tags { get; set; }
    
    /// <summary>
    /// 智能体ID
    /// </summary>
    public long? AgentId { get; set; }
}