using System.Text.Json;
using Koala.Application.Contract.WorkFlows;
using Koala.Application.Contract.WorkFlows.Dto;
using Koala.Core;
using Koala.Data.Repositories;
using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkFlows.Enums;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using WorkflowCore.Interface;
using WorkflowCore.Models;
using StepInstance = Koala.Domain.WorkFlows.Aggregates.WorkflowInstance;
using System.Reflection;

namespace Koala.Application.WorkFlows;

/// <summary>
/// 工作流数据类，用于存储工作流执行过程中的数据
/// </summary>
public class WorkflowData
{
    private readonly Dictionary<string, object> _properties = new();
    private readonly Dictionary<string, string> _inputs = new();

    /// <summary>
    /// 获取属性值
    /// </summary>
    /// <param name="name">属性名</param>
    /// <returns>属性值</returns>
    public object? GetProperty(string name)
    {
        return _properties.GetValueOrDefault(name);
    }

    /// <summary>
    /// 设置属性值
    /// </summary>
    /// <param name="name">属性名</param>
    /// <param name="value">属性值</param>
    public void SetProperty(string name, object value)
    {
        _properties[name] = value;
    }

    public void SetInput(string name, object value)
    {
        _inputs[name] = value.ToString() ?? "";
    }

    public Dictionary<string, string> GetInputs()
    {
        return _inputs;
    }
}

/// <summary>
/// 工作流定义类
/// </summary>
public class FlowDefinition
{
    public List<FlowNode> Nodes { get; set; } = new();
    public List<FlowEdge> Edges { get; set; } = new();
}

/// <summary>
/// 工作流节点
/// </summary>
public class FlowNode
{
    public string Id { get; set; } = null!;
    public string Type { get; set; } = null!;
    public FlowPosition Position { get; set; } = new();
    public FlowNodeData Data { get; set; } = new();
}

/// <summary>
/// 工作流节点数据
/// </summary>
public class FlowNodeData
{
    public string Label { get; set; } = null!;
    public string NodeType { get; set; } = null!;
    public Dictionary<string, string> Inputs { get; set; } = new();
    public Dictionary<string, string> Outputs { get; set; } = new();
    public string? ModelId { get; set; }
}

/// <summary>
/// 工作流节点位置
/// </summary>
public class FlowPosition
{
    public double X { get; set; }
    public double Y { get; set; }
}

/// <summary>
/// 工作流连接
/// </summary>
public class FlowEdge
{
    public string Id { get; set; } = null!;
    public string Source { get; set; } = null!;
    public string Target { get; set; } = null!;
    public string? SourceHandle { get; set; }
    public string? TargetHandle { get; set; }
    public bool Animated { get; set; }
}

/// <summary>
/// 工作流执行服务
/// </summary>
public class WorkflowExecutionService : IWorkflowService
{
    private readonly IRepository<Workflow> _workflowRepository;
    private readonly IRepository<StepInstance> _instanceRepository;
    private readonly IUserContext _userContext;
    private readonly IMapper _mapper;
    private readonly IServiceProvider _serviceProvider;

    /// <summary>
    /// 初始化工作流执行服务
    /// </summary>
    /// <param name="workflowHost">工作流主机</param>
    /// <param name="workflowRepository">工作流仓储</param>
    /// <param name="instanceRepository">实例仓储</param>
    /// <param name="userContext">用户上下文</param>
    /// <param name="mapper"></param>
    /// <param name="serviceProvider"></param>
    public WorkflowExecutionService(
        IRepository<Workflow> workflowRepository,
        IRepository<StepInstance> instanceRepository,
        IUserContext userContext, IMapper mapper, IServiceProvider serviceProvider)
    {
        _workflowRepository = workflowRepository;
        _instanceRepository = instanceRepository;
        _userContext = userContext;
        _mapper = mapper;
        _serviceProvider = serviceProvider;
    }

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
    public async Task<long> CreateWorkflowAsync(string name, string definition, long workspaceId,
        string? description = null, string? tags = null, long? agentId = null)
    {
        var workflow = new Workflow(name, definition, workspaceId, description, tags, agentId);
        workflow.SetCreator(_userContext.UserId);

        await _workflowRepository.AddAsync(workflow);
        await _workflowRepository.SaveChangesAsync();
        return workflow.Id;
    }

    /// <summary>
    /// 更新工作流
    /// </summary>
    /// <param name="id">工作流ID</param>
    /// <param name="name">工作流名称</param>
    /// <param name="definition">工作流定义</param>
    /// <param name="description">工作流描述</param>
    /// <param name="tags">标签</param>
    /// <returns>是否成功</returns>
    public async Task<bool> UpdateWorkflowAsync(long id, string name, string definition, string? description = null,
        string? tags = null)
    {
        var workflow = await _workflowRepository.FirstOrDefaultAsync(w => w.Id == id);
        if (workflow == null)
            return false;

        workflow.SetName(name);
        workflow.SetDefinition(definition);
        workflow.SetDescription(description);
        workflow.SetTags(tags);
        workflow.SetModifier(_userContext.UserId);

        await _workflowRepository.UpdateAsync(workflow);
        await _workflowRepository.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// 绑定智能体
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="agentId">智能体ID</param>
    /// <returns>是否成功</returns>
    public async Task<bool> BindAgentAsync(long workflowId, long agentId)
    {
        var workflow = await _workflowRepository.FirstOrDefaultAsync(w => w.Id == workflowId);
        if (workflow == null)
            return false;

        workflow.BindAgent(agentId);
        workflow.SetModifier(_userContext.UserId);

        await _workflowRepository.UpdateAsync(workflow);
        await _workflowRepository.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// 解绑智能体
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <returns>是否成功</returns>
    public async Task<bool> UnbindAgentAsync(long workflowId)
    {
        var workflow = await _workflowRepository.FirstOrDefaultAsync(w => w.Id == workflowId);
        if (workflow == null)
            return false;

        workflow.UnbindAgent();
        workflow.SetModifier(_userContext.UserId);

        await _workflowRepository.UpdateAsync(workflow);
        await _workflowRepository.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// 更新工作流状态
    /// </summary>
    /// <param name="id">工作流ID</param>
    /// <param name="status">工作流状态</param>
    /// <returns>是否成功</returns>
    public async Task<bool> UpdateWorkflowStatusAsync(long id, WorkflowStatusEnum status)
    {
        var workflow = await _workflowRepository.FirstOrDefaultAsync(w => w.Id == id);
        if (workflow == null)
            return false;

        workflow.SetStatus(status);
        workflow.SetModifier(_userContext.UserId);

        await _workflowRepository.UpdateAsync(workflow);
        await _workflowRepository.SaveChangesAsync();
        return true;
    }

    /// <summary>
    /// 获取工作流
    /// </summary>
    /// <param name="id">工作流ID</param>
    /// <returns>工作流</returns>
    public async Task<WorkflowDto?> GetWorkflowAsync(long id)
    {
        var value = await _workflowRepository.FirstOrDefaultAsync(w => w.Id == id);

        return value == null ? null : _mapper.Map<WorkflowDto>(value);
    }

    /// <summary>
    /// 获取智能体关联的工作流
    /// </summary>
    /// <param name="agentId">智能体ID</param>
    /// <returns>工作流集合</returns>
    public async Task<IEnumerable<WorkflowDto>> GetWorkflowsByAgentAsync(long agentId)
    {
        // 实际实现需要根据具体的仓储接口进行调整
        var values = await _workflowRepository.ListAsync(w => w.AgentId == agentId);

        return _mapper.Map<IEnumerable<WorkflowDto>>(values);
    }

    /// <summary>
    /// 获取工作空间下的工作流
    /// </summary>
    /// <param name="workspaceId">工作空间ID</param>
    /// <param name="status">工作流状态</param>
    /// <returns>工作流集合</returns>
    public async Task<IEnumerable<WorkflowDto>> GetWorkflowsByWorkspaceAsync(long workspaceId,
        WorkflowStatusEnum? status = null)
    {
        if (status.HasValue)
        {
            var value = await _workflowRepository.ListAsync(w =>
                w.WorkspaceId == workspaceId && w.Status == status.Value);

            return _mapper.Map<IEnumerable<WorkflowDto>>(value);
        }
        else
        {
            var values = await _workflowRepository.ListAsync(w => w.WorkspaceId == workspaceId);

            return _mapper.Map<IEnumerable<WorkflowDto>>(values);
        }
    }

    /// <summary>
    /// 执行工作流实例
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="input"></param>
    /// <param name="inputData">输入数据（JSON格式）</param>
    /// <returns>工作流实例ID</returns>
    public async Task<string> ExecuteWorkflowAsync(long workflowId, Dictionary<string, string> input,
        string? inputData = null)
    {
        var workflow = await _workflowRepository.FirstOrDefaultAsync(w => w.Id == workflowId);
        if (workflow == null)
            throw new ArgumentException($"工作流不存在: {workflowId}");

        if (workflow.Status != WorkflowStatusEnum.Published)
            throw new InvalidOperationException($"工作流状态不是已发布: {workflow.Status}");

        // 生成实例参考ID
        var referenceId = Guid.NewGuid().ToString();

        // 创建工作流实例记录
        var instance = new StepInstance(referenceId, workflowId, workflow.Version, inputData);
        instance.SetCreator(_userContext.UserId);
        await _instanceRepository.AddAsync(instance);
        await _instanceRepository.SaveChangesAsync();

        try
        {
            // 直接执行工作流，使用WorkflowExecutor
            var result =
                WorkflowExecutor.ProcessFlowDefinition(_serviceProvider, workflow.Definition, inputData, input);

            // 将执行结果转换成JSON
            var resultJson = JsonSerializer.Serialize(result);

            // 更新工作流实例状态
            instance.UpdateData(resultJson);
            instance.Complete();
            await _instanceRepository.UpdateAsync(instance);
            await _instanceRepository.SaveChangesAsync();

            return referenceId;
        }
        catch (Exception ex)
        {
            // 如果尚未设置失败状态，则设置
            if (instance.Status != WorkflowInstanceStatusEnum.Failed)
            {
                instance.Fail(ex.Message);
                await _instanceRepository.UpdateAsync(instance);
                await _instanceRepository.SaveChangesAsync();
            }

            throw;
        }
    }

    /// <summary>
    /// 暂停工作流实例
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>是否成功</returns>
    public async Task<bool> SuspendWorkflowInstanceAsync(string instanceId)
    {
        var instance = await GetInstanceByReferenceIdAsync(instanceId);
        if (instance == null)
            return false;

        instance.Suspend();
        instance.SetModifier(_userContext.UserId);
        await _instanceRepository.UpdateAsync(instance);
        await _instanceRepository.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// 恢复工作流实例
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>是否成功</returns>
    public async Task<bool> ResumeWorkflowInstanceAsync(string instanceId)
    {
        var instance = await GetInstanceByReferenceIdAsync(instanceId);
        if (instance == null)
            return false;

        instance.Resume();
        instance.SetModifier(_userContext.UserId);
        await _instanceRepository.UpdateAsync(instance);
        await _instanceRepository.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// 取消工作流实例
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>是否成功</returns>
    public async Task<bool> CancelWorkflowInstanceAsync(string instanceId)
    {
        var instance = await GetInstanceByReferenceIdAsync(instanceId);
        if (instance == null)
            return false;

        instance.Cancel();
        instance.SetModifier(_userContext.UserId);
        await _instanceRepository.UpdateAsync(instance);
        await _instanceRepository.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// 获取工作流实例信息
    /// </summary>
    /// <param name="instanceId">实例ID</param>
    /// <returns>工作流实例</returns>
    public async Task<WorkflowInstanceDto?> GetWorkflowInstanceAsync(string instanceId)
    {
        var value = await GetInstanceByReferenceIdAsync(instanceId);

        return value == null ? null : _mapper.Map<WorkflowInstanceDto>(value);
    }

    /// <summary>
    /// 获取工作流实例列表
    /// </summary>
    /// <param name="workflowId">工作流ID</param>
    /// <param name="status">实例状态</param>
    /// <returns>工作流实例集合</returns>
    public async Task<IEnumerable<WorkflowInstanceDto>> GetWorkflowInstancesAsync(long workflowId,
        WorkflowInstanceStatusEnum? status = null)
    {
        if (status.HasValue)
        {
            var value = await _instanceRepository.ListAsync(i =>
                i.WorkflowId == workflowId && i.Status == status.Value);

            return _mapper.Map<IEnumerable<WorkflowInstanceDto>>(value);
        }
        else
        {
            var values = await _instanceRepository.ListAsync(i => i.WorkflowId == workflowId);

            return _mapper.Map<IEnumerable<WorkflowInstanceDto>>(values);
        }
    }

    /// <summary>
    /// 根据参考ID获取工作流实例
    /// </summary>
    /// <param name="referenceId">参考ID</param>
    /// <returns>实例</returns>
    private async Task<StepInstance?> GetInstanceByReferenceIdAsync(string referenceId)
    {
        return await _instanceRepository.FirstOrDefaultAsync(i => i.ReferenceId == referenceId);
    }
}