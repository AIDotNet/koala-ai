using Koala.Domain.WorkFlows.Enums;

namespace Koala.Domain.WorkFlows.Aggregates;

/// <summary>
/// 工作流节点实体
/// </summary>
public class WorkflowNode : AuditEntity<long>
{
    /// <summary>
    /// 节点ID（在工作流内唯一）
    /// </summary>
    public string NodeId { get; private set; } = null!;

    /// <summary>
    /// 节点名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 节点类型
    /// </summary>
    public NodeTypeEnum NodeType { get; private set; }

    /// <summary>
    /// 节点配置（JSON格式）
    /// </summary>
    public string? Configuration { get; private set; }

    /// <summary>
    /// 工作流ID
    /// </summary>
    public long WorkflowId { get; private set; }

    /// <summary>
    /// 位置X坐标
    /// </summary>
    public double PositionX { get; private set; }

    /// <summary>
    /// 位置Y坐标
    /// </summary>
    public double PositionY { get; private set; }

    /// <summary>
    /// 导航属性 - 工作流
    /// </summary>
    public virtual Workflow Workflow { get; private set; } = null!;

    /// <summary>
    /// 导航属性 - 节点出口连接集合
    /// </summary>
    public virtual ICollection<WorkflowConnection> OutgoingConnections { get; private set; } = new List<WorkflowConnection>();

    /// <summary>
    /// 导航属性 - 节点入口连接集合
    /// </summary>
    public virtual ICollection<WorkflowConnection> IncomingConnections { get; private set; } = new List<WorkflowConnection>();

    /// <summary>
    /// 创建节点
    /// </summary>
    /// <param name="nodeId">节点ID</param>
    /// <param name="name">节点名称</param>
    /// <param name="nodeType">节点类型</param>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="positionX">X坐标</param>
    /// <param name="positionY">Y坐标</param>
    /// <param name="configuration">配置信息</param>
    public WorkflowNode(string nodeId, string name, NodeTypeEnum nodeType, long workflowId, double positionX = 0, double positionY = 0, string? configuration = null)
    {
        SetNodeId(nodeId);
        SetName(name);
        NodeType = nodeType;
        WorkflowId = workflowId;
        PositionX = positionX;
        PositionY = positionY;
        Configuration = configuration;
    }

    /// <summary>
    /// 设置节点ID
    /// </summary>
    /// <param name="nodeId">节点ID</param>
    /// <exception cref="ArgumentException">ID为空异常</exception>
    public void SetNodeId(string nodeId)
    {
        if (nodeId.IsNullOrEmpty())
        {
            throw new ArgumentException("节点ID不能为空");
        }

        NodeId = nodeId;
    }

    /// <summary>
    /// 设置节点名称
    /// </summary>
    /// <param name="name">节点名称</param>
    /// <exception cref="ArgumentException">名称为空或超长异常</exception>
    public void SetName(string name)
    {
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("节点名称不能为空");
        }

        if (name.Length > 50)
        {
            throw new ArgumentException("节点名称长度不能超过50");
        }

        Name = name;
    }

    /// <summary>
    /// 设置节点配置
    /// </summary>
    /// <param name="configuration">配置信息</param>
    public void SetConfiguration(string? configuration)
    {
        Configuration = configuration;
    }

    /// <summary>
    /// 更新节点位置
    /// </summary>
    /// <param name="x">X坐标</param>
    /// <param name="y">Y坐标</param>
    public void UpdatePosition(double x, double y)
    {
        PositionX = x;
        PositionY = y;
    }

    /// <summary>
    /// 实体构造函数
    /// </summary>
    protected WorkflowNode()
    {
    }
} 