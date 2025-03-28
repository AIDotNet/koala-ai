using System.Text.Json;
using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkFlows.Definitions;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Domain.WorkFlows.Steps;

/// <summary>
/// 工作流步骤基类
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
/// <typeparam name="TStepBody">步骤体类型</typeparam>
public abstract class WorkflowStepBase<TData, TStepBody> : IWorkflowStep<TData>
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

        // 配置输入参数
        step = (IStepBuilder<TData, TStepBody>)ConfigureInput((IStepBuilder<TData, IStepBody>)step);

        // 配置输出参数
        step = (IStepBuilder<TData, TStepBody>)ConfigureOutput((IStepBuilder<TData, IStepBody>)step);

        return (IStepBuilder<TData, IStepBody>)step;
    }

    /// <summary>
    /// 获取步骤对应的步骤体
    /// </summary>
    /// <returns>步骤体类型</returns>
    public Type GetStepBodyType() => typeof(TStepBody);

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public virtual IStepBuilder<TData, IStepBody> ConfigureInput(IStepBuilder<TData, IStepBody> step)
    {
        return step;
    }

    /// <summary>
    /// 配置输出参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public virtual IStepBuilder<TData, IStepBody> ConfigureOutput(IStepBuilder<TData, IStepBody> step)
    {
        return step;
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
} 