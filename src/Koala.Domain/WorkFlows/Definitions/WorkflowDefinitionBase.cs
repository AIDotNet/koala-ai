using Koala.Domain.WorkFlows.Steps;
using WorkflowCore.Interface;

namespace Koala.Domain.WorkFlows.Definitions;

/// <summary>
/// 工作流定义基类
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public abstract class WorkflowDefinitionBase<TData> : IWorkflow<TData>
    where TData : WorkflowData, new()
{
    private readonly List<IWorkflowStep<TData>> _steps = new();

    /// <summary>
    /// 工作流ID
    /// </summary>
    public abstract string Id { get; }

    /// <summary>
    /// 工作流版本
    /// </summary>
    public abstract int Version { get; }

    /// <summary>
    /// 工作流描述
    /// </summary>
    public abstract string Description { get; }

    /// <summary>
    /// 添加步骤
    /// </summary>
    /// <param name="step">工作流步骤</param>
    protected void AddStep(IWorkflowStep<TData> step)
    {
        _steps.Add(step);
    }

    /// <summary>
    /// 构建工作流
    /// </summary>
    /// <param name="builder">工作流构建器</param>
    public virtual void Build(IWorkflowBuilder<TData> builder)
    {
        if (_steps.Count == 0)
        {
            ConfigureSteps();
        }

        if (_steps.Count == 0)
        {
            throw new InvalidOperationException("工作流必须包含至少一个步骤");
        }

        // 初始化第一个步骤
        var firstStep = _steps[0];
        var stepBuilder = firstStep.Initialize(builder);

        // 连接后续步骤
        for (int i = 1; i < _steps.Count; i++)
        {
            var currentStep = _steps[i];
            stepBuilder = currentStep.Initialize(builder);
        }
    }

    /// <summary>
    /// 配置工作流步骤
    /// </summary>
    protected abstract void ConfigureSteps();
} 