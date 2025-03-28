using Koala.Domain.Agents.Aggregates;
using Koala.Domain.WorkFlows.Enums;

namespace Koala.Domain.WorkFlows.Aggregates;

/// <summary>
/// 工作流实体
/// </summary>
public class Workflow : AuditEntity<long>
{
    /// <summary>
    /// 工作流名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 工作流描述
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// 工作流版本
    /// </summary>
    public int Version { get; private set; } = 1;

    /// <summary>
    /// 工作流状态
    /// </summary>
    public WorkflowStatusEnum Status { get; private set; } = WorkflowStatusEnum.Draft;

    /// <summary>
    /// 工作流定义（JSON格式）
    /// </summary>
    public string Definition { get; private set; } = null!;

    /// <summary>
    /// 关联的智能体ID（可为空）
    /// </summary>
    public long? AgentId { get; private set; }

    /// <summary>
    /// 工作空间ID
    /// </summary>
    public long WorkspaceId { get; private set; }

    /// <summary>
    /// 标签（JSON数组格式，可为空）
    /// </summary>
    public string? Tags { get; private set; }

    /// <summary>
    /// 导航属性 - 工作流节点集合
    /// </summary>
    public virtual ICollection<WorkflowNode> Nodes { get; private set; } = new List<WorkflowNode>();

    /// <summary>
    /// 导航属性 - 智能体
    /// </summary>
    public virtual Agent? Agent { get; private set; }

    /// <summary>
    /// 导航属性 - 工作空间
    /// </summary>
    public virtual WorkSpaces.Aggregates.WorkSpace Workspace { get; private set; } = null!;

    /// <summary>
    /// 创建工作流
    /// </summary>
    /// <param name="name">工作流名称</param>
    /// <param name="definition">工作流定义</param>
    /// <param name="workspaceId">工作空间ID</param>
    /// <param name="description">工作流描述</param>
    /// <param name="tags">标签</param>
    /// <param name="agentId">智能体ID</param>
    public Workflow(string name, string definition, long workspaceId, string? description = null, string? tags = null, long? agentId = null)
    {
        SetName(name);
        SetDefinition(definition);
        WorkspaceId = workspaceId;
        Description = description;
        Tags = tags;
        AgentId = agentId;
    }

    /// <summary>
    /// 设置工作流名称
    /// </summary>
    /// <param name="name">工作流名称</param>
    /// <exception cref="ArgumentException">名称为空或超长异常</exception>
    public void SetName(string name)
    {
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("工作流名称不能为空");
        }

        if (name.Length > 50)
        {
            throw new ArgumentException("工作流名称长度不能超过50");
        }

        Name = name;
    }

    /// <summary>
    /// 设置工作流描述
    /// </summary>
    /// <param name="description">工作流描述</param>
    public void SetDescription(string? description)
    {
        if (description?.Length > 200)
        {
            throw new ArgumentException("工作流描述长度不能超过200");
        }

        Description = description;
    }

    /// <summary>
    /// 设置工作流定义
    /// </summary>
    /// <param name="definition">工作流定义</param>
    /// <exception cref="ArgumentException">定义为空异常</exception>
    public void SetDefinition(string definition)
    {
        if (definition.IsNullOrEmpty())
        {
            throw new ArgumentException("工作流定义不能为空");
        }

        Definition = definition;
        Version++; // 更新工作流版本
    }

    /// <summary>
    /// 设置工作流状态
    /// </summary>
    /// <param name="status">工作流状态</param>
    public void SetStatus(WorkflowStatusEnum status)
    {
        Status = status;
    }

    /// <summary>
    /// 绑定智能体
    /// </summary>
    /// <param name="agentId">智能体ID</param>
    public void BindAgent(long agentId)
    {
        AgentId = agentId;
    }

    /// <summary>
    /// 解绑智能体
    /// </summary>
    public void UnbindAgent()
    {
        AgentId = null;
    }

    /// <summary>
    /// 设置标签
    /// </summary>
    /// <param name="tags">标签（JSON数组）</param>
    public void SetTags(string? tags)
    {
        Tags = tags;
    }

    /// <summary>
    /// 发布工作流
    /// </summary>
    public void Publish()
    {
        Status = WorkflowStatusEnum.Published;
    }

    /// <summary>
    /// 归档工作流
    /// </summary>
    public void Archive()
    {
        Status = WorkflowStatusEnum.Archived;
    }

    /// <summary>
    /// 删除工作流
    /// </summary>
    public void Delete()
    {
        Status = WorkflowStatusEnum.Deleted;
    }

    /// <summary>
    /// 实体构造函数
    /// </summary>
    protected Workflow()
    {
    }
} 