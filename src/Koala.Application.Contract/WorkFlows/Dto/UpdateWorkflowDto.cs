using System;

namespace Koala.Application.Contract.WorkFlows.Dto;

/// <summary>
/// 更新工作流请求DTO
/// </summary>
public class UpdateWorkflowDto
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
    /// 工作流描述
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// 标签（逗号分隔）
    /// </summary>
    public string? Tags { get; set; }
}