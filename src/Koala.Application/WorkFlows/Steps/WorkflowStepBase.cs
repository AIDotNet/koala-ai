using System.Text.Json;
using Koala.Application.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkFlows.Definitions;
using WorkflowCore.Interface;
using WorkflowCore.Models;
using WorkflowCore.Services;

namespace Koala.Domain.WorkFlows.Steps;

/// <summary>
/// 工作流步骤基类
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
/// <typeparam name="TStepBody">步骤体类型</typeparam>
public abstract class WorkflowStepBase<TData, TStepBody> : WorkflowStep<TStepBody>, IWorkflowStep<TData>
    where TData : WorkflowData, new()
    where TStepBody : IStepBody, new()
{
    /// <summary>
    /// 步骤ID
    /// </summary>
    public string StepId { get; set; } = Guid.NewGuid().ToString();

    /// <summary>
    /// 步骤名称
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 对应的工作流节点
    /// </summary>
    public WorkflowNode? Node { get; set; }

    /// <summary>
    /// 执行配置
    /// </summary>
    public string? Configuration { get; set; }

    /// <summary>
    /// 输入参数映射
    /// </summary>
    protected Dictionary<string, string>? InputParameters { get; set; }

    /// <summary>
    /// 输出参数映射
    /// </summary>
    protected Dictionary<string, string>? OutputParameters { get; set; }

    /// <summary>
    /// 初始化步骤
    /// </summary>
    /// <param name="context">工作流构建上下文</param>
    /// <returns>工作流步骤构建器</returns>
    public virtual IStepBuilder<TData, IStepBody> Initialize(IWorkflowBuilder<TData> context)
    {
        // 解析配置
        ParseConfiguration();

        // 创建步骤
        var step = context.StartWith<TStepBody>()
            .Id(StepId)
            .Name(Name);

        // 应用输入参数配置 - 子类中实现
        ConfigureInputInternal(step);

        // 应用输出参数配置 - 子类中实现
        ConfigureOutputInternal(step);

        return new StepBuilder<TData, IStepBody>(step.WorkflowBuilder, new WorkflowStep<IStepBody>()
        {
            CancelCondition = step.Step.CancelCondition,
            Children = step.Step.Children,
            CompensationStepId = step.Step.CompensationStepId,
            ExternalId = step.Step.ExternalId,
            Id = step.Step.Id,
            Name = step.Step.Name,
            ErrorBehavior = step.Step.ErrorBehavior,
            Outcomes = step.Step.Outcomes,
            RetryInterval = step.Step.RetryInterval,
            Inputs = step.Step.Inputs,
            Outputs = step.Step.Outputs,
            ProceedOnCancel = step.Step.ProceedOnCancel,
        });
    }

    /// <summary>
    /// 获取步骤对应的步骤体
    /// </summary>
    /// <returns>步骤体类型</returns>
    public Type GetStepBodyType() => typeof(TStepBody);

    /// <summary>
    /// 配置输入参数的内部实现
    /// </summary>
    /// <param name="step">步骤构建器</param>
    protected virtual void ConfigureInputInternal(IStepBuilder<TData, TStepBody> step)
    {
        // 这里使用正确的类型，子类可以重写此方法
        // 默认实现为空
    }

    /// <summary>
    /// 配置输出参数的内部实现
    /// </summary>
    /// <param name="step">步骤构建器</param>
    protected virtual void ConfigureOutputInternal(IStepBuilder<TData, TStepBody> step)
    {
        // 这里使用正确的类型，子类可以重写此方法
        // 默认实现为空
    }

    /// <summary>
    /// 解析配置
    /// </summary>
    protected virtual void ParseConfiguration()
    {
        if (string.IsNullOrEmpty(Configuration))
            return;

        try
        {
            var config = JsonSerializer.Deserialize<StepConfiguration>(Configuration);
            if (config != null)
            {
                InputParameters = config.Inputs;
                OutputParameters = config.Outputs;
            }
        }
        catch (Exception)
        {
            // 配置解析失败，使用默认值
        }
    }

    /// <summary>
    /// 步骤配置模型
    /// </summary>
    protected class StepConfiguration
    {
        /// <summary>
        /// 输入参数映射
        /// </summary>
        public Dictionary<string, string>? Inputs { get; set; }

        /// <summary>
        /// 输出参数映射
        /// </summary>
        public Dictionary<string, string>? Outputs { get; set; }
    }

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public virtual IStepBuilder<TData, IStepBody> ConfigureInput(IStepBuilder<TData, IStepBody> step)
    {
        // 此方法为接口实现，但实际工作由ConfigureInputInternal处理
        // 在实际使用中，应重写ConfigureInputInternal而非此方法
        return step;
    }

    /// <summary>
    /// 配置输出参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public virtual IStepBuilder<TData, IStepBody> ConfigureOutput(IStepBuilder<TData, IStepBody> step)
    {
        // 此方法为接口实现，但实际工作由ConfigureOutputInternal处理
        // 在实际使用中，应重写ConfigureOutputInternal而非此方法
        return step;
    }
}