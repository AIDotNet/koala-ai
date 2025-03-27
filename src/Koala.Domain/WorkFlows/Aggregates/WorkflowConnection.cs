using Koala.Domain.WorkFlows.Enums;

namespace Koala.Domain.WorkFlows.Aggregates;

/// <summary>
/// 工作流连接实体
/// </summary>
public class WorkflowConnection : AuditEntity<long>
{
    /// <summary>
    /// 连接ID（在工作流内唯一）
    /// </summary>
    public string ConnectionId { get; private set; } = null!;

    /// <summary>
    /// 连接名称
    /// </summary>
    public string? Name { get; private set; }

    /// <summary>
    /// 工作流ID
    /// </summary>
    public long WorkflowId { get; private set; }

    /// <summary>
    /// 源节点ID
    /// </summary>
    public long SourceNodeId { get; private set; }

    /// <summary>
    /// 目标节点ID
    /// </summary>
    public long TargetNodeId { get; private set; }

    /// <summary>
    /// 连接类型
    /// </summary>
    public ConnectionTypeEnum ConnectionType { get; private set; } = ConnectionTypeEnum.Default;

    /// <summary>
    /// 条件表达式（用于条件连接）
    /// </summary>
    public string? Condition { get; private set; }

    /// <summary>
    /// 导航属性 - 工作流
    /// </summary>
    public virtual Workflow Workflow { get; private set; } = null!;

    /// <summary>
    /// 导航属性 - 源节点
    /// </summary>
    public virtual WorkflowNode SourceNode { get; private set; } = null!;

    /// <summary>
    /// 导航属性 - 目标节点
    /// </summary>
    public virtual WorkflowNode TargetNode { get; private set; } = null!;

    /// <summary>
    /// 创建连接
    /// </summary>
    /// <param name="connectionId">连接ID</param>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="sourceNodeId">源节点ID</param>
    /// <param name="targetNodeId">目标节点ID</param>
    /// <param name="connectionType">连接类型</param>
    /// <param name="name">连接名称</param>
    /// <param name="condition">条件表达式</param>
    public WorkflowConnection(string connectionId, long workflowId, long sourceNodeId, long targetNodeId, 
        ConnectionTypeEnum connectionType = ConnectionTypeEnum.Default, string? name = null, string? condition = null)
    {
        SetConnectionId(connectionId);
        WorkflowId = workflowId;
        SourceNodeId = sourceNodeId;
        TargetNodeId = targetNodeId;
        ConnectionType = connectionType;
        Name = name;
        Condition = condition;
    }

    /// <summary>
    /// 设置连接ID
    /// </summary>
    /// <param name="connectionId">连接ID</param>
    /// <exception cref="ArgumentException">ID为空异常</exception>
    public void SetConnectionId(string connectionId)
    {
        if (connectionId.IsNullOrEmpty())
        {
            throw new ArgumentException("连接ID不能为空");
        }

        ConnectionId = connectionId;
    }

    /// <summary>
    /// 设置连接名称
    /// </summary>
    /// <param name="name">连接名称</param>
    public void SetName(string? name)
    {
        if (name?.Length > 50)
        {
            throw new ArgumentException("连接名称长度不能超过50");
        }

        Name = name;
    }

    /// <summary>
    /// 设置连接类型
    /// </summary>
    /// <param name="connectionType">连接类型</param>
    public void SetConnectionType(ConnectionTypeEnum connectionType)
    {
        ConnectionType = connectionType;
    }

    /// <summary>
    /// 设置条件表达式
    /// </summary>
    /// <param name="condition">条件表达式</param>
    public void SetCondition(string? condition)
    {
        Condition = condition;
    }

    /// <summary>
    /// 实体构造函数
    /// </summary>
    protected WorkflowConnection()
    {
    }
} 