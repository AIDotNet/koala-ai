using Koala.Domain.WorkFlows.Enums;

namespace Koala.Domain.WorkFlows.Aggregates;

/// <summary>
/// 工作流实例实体
/// </summary>
public class WorkflowInstance : AuditEntity<long>
{
    /// <summary>
    /// 实例参考ID（用于外部系统关联）
    /// </summary>
    public string ReferenceId { get; private set; } = null!;

    /// <summary>
    /// 工作流ID
    /// </summary>
    public long WorkflowId { get; private set; }

    /// <summary>
    /// 工作流版本号（记录创建时的工作流版本）
    /// </summary>
    public int WorkflowVersion { get; private set; }

    /// <summary>
    /// 实例状态
    /// </summary>
    public WorkflowInstanceStatusEnum Status { get; private set; } = WorkflowInstanceStatusEnum.Running;

    /// <summary>
    /// 实例数据（JSON格式）
    /// </summary>
    public string? Data { get; private set; }

    /// <summary>
    /// 当前活动节点ID
    /// </summary>
    public string? CurrentNodeId { get; private set; }

    /// <summary>
    /// 开始时间
    /// </summary>
    public DateTimeOffset StartTime { get; private set; }

    /// <summary>
    /// 结束时间
    /// </summary>
    public DateTimeOffset? EndTime { get; private set; }

    /// <summary>
    /// 错误信息
    /// </summary>
    public string? ErrorMessage { get; private set; }

    /// <summary>
    /// Workflow Core实例ID
    /// </summary>
    public string? WorkflowCoreInstanceId { get; private set; }

    /// <summary>
    /// 导航属性 - 工作流
    /// </summary>
    public virtual Workflow Workflow { get; private set; } = null!;

    /// <summary>
    /// 创建工作流实例
    /// </summary>
    /// <param name="referenceId">实例参考ID</param>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="workflowVersion">工作流版本号</param>
    /// <param name="data">实例数据</param>
    /// <param name="workflowCoreInstanceId">Workflow Core实例ID</param>
    public WorkflowInstance(string referenceId, long workflowId, int workflowVersion, string? data = null, string? workflowCoreInstanceId = null)
    {
        SetReferenceId(referenceId);
        WorkflowId = workflowId;
        WorkflowVersion = workflowVersion;
        Data = data;
        WorkflowCoreInstanceId = workflowCoreInstanceId;
        StartTime = DateTimeOffset.Now;
    }

    /// <summary>
    /// 设置实例参考ID
    /// </summary>
    /// <param name="referenceId">实例参考ID</param>
    /// <exception cref="ArgumentException">ID为空异常</exception>
    public void SetReferenceId(string referenceId)
    {
        if (referenceId.IsNullOrEmpty())
        {
            throw new ArgumentException("实例参考ID不能为空");
        }

        ReferenceId = referenceId;
    }

    /// <summary>
    /// 更新实例数据
    /// </summary>
    /// <param name="data">实例数据</param>
    public void UpdateData(string? data)
    {
        Data = data;
    }

    /// <summary>
    /// 更新当前节点
    /// </summary>
    /// <param name="nodeId">当前活动节点ID</param>
    public void UpdateCurrentNode(string? nodeId)
    {
        CurrentNodeId = nodeId;
    }

    /// <summary>
    /// 完成工作流实例
    /// </summary>
    public void Complete()
    {
        Status = WorkflowInstanceStatusEnum.Completed;
        EndTime = DateTimeOffset.Now;
    }

    /// <summary>
    /// 暂停工作流实例
    /// </summary>
    public void Suspend()
    {
        Status = WorkflowInstanceStatusEnum.Suspended;
    }

    /// <summary>
    /// 恢复工作流实例
    /// </summary>
    public void Resume()
    {
        Status = WorkflowInstanceStatusEnum.Running;
    }

    /// <summary>
    /// 标记失败
    /// </summary>
    /// <param name="errorMessage">错误信息</param>
    public void Fail(string errorMessage)
    {
        Status = WorkflowInstanceStatusEnum.Failed;
        ErrorMessage = errorMessage;
        EndTime = DateTimeOffset.Now;
    }

    /// <summary>
    /// 取消工作流实例
    /// </summary>
    public void Cancel()
    {
        Status = WorkflowInstanceStatusEnum.Cancelled;
        EndTime = DateTimeOffset.Now;
    }

    /// <summary>
    /// 设置Workflow Core实例ID
    /// </summary>
    /// <param name="instanceId">Workflow Core实例ID</param>
    public void SetWorkflowCoreInstanceId(string instanceId)
    {
        WorkflowCoreInstanceId = instanceId;
    }

    /// <summary>
    /// 实体构造函数
    /// </summary>
    protected WorkflowInstance()
    {
    }
} 