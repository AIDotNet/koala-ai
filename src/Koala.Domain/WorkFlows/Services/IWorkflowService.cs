using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkFlows.Enums;

namespace Koala.Domain.WorkFlows.Services;

/// <summary>
/// 工作流服务接口
/// </summary>
public interface IWorkflowService
{
    /// <summary>
    /// 创建工作流
    /// </summary>
    /// <param name="name">工作流名称</param>
    /// <param name="definition">工作流定义</param>
    /// <param name="workspaceId">工作空间ID</param>
    /// <param name="description">工作流描述</param>
    /// <param name="tags">标签</param>
    /// <param name="agentId">智能体ID</param>
    /// <returns>工作流ID</returns>
    Task<long> CreateWorkflowAsync(string name, string definition, long workspaceId, string? description = null, string? tags = null, long? agentId = null);

    /// <summary>
    /// 更新工作流
    /// </summary>
    /// <param name="id">工作流ID</param>
    /// <param name="name">工作流名称</param>
    /// <param name="definition">工作流定义</param>
    /// <param name="description">工作流描述</param>
    /// <param name="tags">标签</param>
    /// <returns>是否成功</returns>
    Task<bool> UpdateWorkflowAsync(long id, string name, string definition, string? description = null, string? tags = null);

    /// <summary>
    /// 绑定智能体
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="agentId">智能体ID</param>
    /// <returns>是否成功</returns>
    Task<bool> BindAgentAsync(long workflowId, long agentId);

    /// <summary>
    /// 解绑智能体
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <returns>是否成功</returns>
    Task<bool> UnbindAgentAsync(long workflowId);

    /// <summary>
    /// 更新工作流状态
    /// </summary>
    /// <param name="id">工作流ID</param>
    /// <param name="status">工作流状态</param>
    /// <returns>是否成功</returns>
    Task<bool> UpdateWorkflowStatusAsync(long id, WorkflowStatusEnum status);

    /// <summary>
    /// 获取工作流
    /// </summary>
    /// <param name="id">工作流ID</param>
    /// <returns>工作流</returns>
    Task<Workflow?> GetWorkflowAsync(long id);

    /// <summary>
    /// 获取智能体关联的工作流
    /// </summary>
    /// <param name="agentId">智能体ID</param>
    /// <returns>工作流集合</returns>
    Task<IEnumerable<Workflow>> GetWorkflowsByAgentAsync(long agentId);

    /// <summary>
    /// 获取工作空间下的工作流
    /// </summary>
    /// <param name="workspaceId">工作空间ID</param>
    /// <param name="status">工作流状态</param>
    /// <returns>工作流集合</returns>
    Task<IEnumerable<Workflow>> GetWorkflowsByWorkspaceAsync(long workspaceId, WorkflowStatusEnum? status = null);

    /// <summary>
    /// 执行工作流实例
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="inputData">输入数据（JSON格式）</param>
    /// <returns>工作流实例ID</returns>
    Task<string> ExecuteWorkflowAsync(long workflowId, string? inputData = null);

    /// <summary>
    /// 暂停工作流实例
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>是否成功</returns>
    Task<bool> SuspendWorkflowInstanceAsync(string instanceId);

    /// <summary>
    /// 恢复工作流实例
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>是否成功</returns>
    Task<bool> ResumeWorkflowInstanceAsync(string instanceId);

    /// <summary>
    /// 取消工作流实例
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>是否成功</returns>
    Task<bool> CancelWorkflowInstanceAsync(string instanceId);

    /// <summary>
    /// 获取工作流实例信息
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>工作流实例</returns>
    Task<WorkflowInstance?> GetWorkflowInstanceAsync(string instanceId);

    /// <summary>
    /// 获取工作流实例列表
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="status">实例状态</param>
    /// <returns>工作流实例集合</returns>
    Task<IEnumerable<WorkflowInstance>> GetWorkflowInstancesAsync(long workflowId, WorkflowInstanceStatusEnum? status = null);
} 