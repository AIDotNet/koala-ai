using Koala.Domain.WorkFlows.Aggregates;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Domain.WorkFlows.Steps;

/// <summary>
/// 工作流步骤接口
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public interface IWorkflowStep<TData>
    where TData : class, new()
{
    /// <summary>
    /// 步骤ID
    /// </summary>
    string StepId { get; set; }

    /// <summary>
    /// 步骤名称
    /// </summary>
    string Name { get; set; }

    /// <summary>
    /// 对应的工作流节点
    /// </summary>
    WorkflowNode? Node { get; set; }

    /// <summary>
    /// 执行配置
    /// </summary>
    string? Configuration { get; set; }

    /// <summary>
    /// 初始化步骤
    /// </summary>
    /// <param name="context">工作流构建上下文</param>
    /// <returns>工作流步骤构建器</returns>
    IStepBuilder<TData, IStepBody> Initialize(IWorkflowBuilder<TData> context);

    /// <summary>
    /// 获取步骤对应的步骤体
    /// </summary>
    /// <returns>步骤体类型</returns>
    Type GetStepBodyType();

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    IStepBuilder<TData, IStepBody> ConfigureInput(IStepBuilder<TData, IStepBody> step);

    /// <summary>
    /// 配置输出参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    IStepBuilder<TData, IStepBody> ConfigureOutput(IStepBuilder<TData, IStepBody> step);
} 