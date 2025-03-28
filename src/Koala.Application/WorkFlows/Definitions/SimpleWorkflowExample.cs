using System.Text.Json;
using Koala.Application.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Steps;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Domain.WorkFlows.Definitions;

/// <summary>
/// 简单工作流数据
/// </summary>
public class SimpleWorkflowData : WorkflowData
{
    /// <summary>
    /// 用户输入
    /// </summary>
    public string UserInput { get; set; } = string.Empty;

    /// <summary>
    /// LLM响应
    /// </summary>
    public string LlmResponse { get; set; } = string.Empty;

    /// <summary>
    /// 最终输出
    /// </summary>
    public string FinalOutput { get; set; } = string.Empty;
}

/// <summary>
/// 简单工作流示例
/// </summary>
public class SimpleWorkflowExample : WorkflowDefinitionBase<SimpleWorkflowData>
{
    /// <summary>
    /// 工作流ID
    /// </summary>
    public override string Id => "SimpleWorkflow";

    /// <summary>
    /// 工作流版本
    /// </summary>
    public override int Version => 1;

    /// <summary>
    /// 工作流描述
    /// </summary>
    public override string Description => "简单工作流示例，展示输入、LLM调用和输出的基本流程";

    /// <summary>
    /// 配置工作流步骤
    /// </summary>
    protected override void ConfigureSteps()
    {
        // 1. LLM调用步骤
        var llmCallStep = new LlmCallStep<SimpleWorkflowData>
        {
            StepId = "LlmCall",
            Name = "LLM调用",
            Configuration = JsonSerializer.Serialize(new LlmCallStep<SimpleWorkflowData>.LlmCallStepConfig
            {
                ModelName = "gpt-3.5-turbo",
                PromptTemplate = "用户输入：{{UserInput}}，请对此进行分析并给出回复。",
                Temperature = 0.7f,
                MaxTokens = 1000,
                VariableMappings = new Dictionary<string, string>
                {
                    ["UserInput"] = "UserInput"
                },
                OutputKey = "LlmResponse"
            })
        };
        AddStep(llmCallStep);

        // 2. 自定义处理步骤 - 使用简化的内联函数方式
        var processStep = new InlineFunctionStep<SimpleWorkflowData>
        {
            StepId = "ProcessOutput",
            Name = "处理输出",
            Execute = async (context, data) =>
            {
                // 简单处理 - 将LLM响应包装为最终输出
                var llmResponse = data.GetProperty<string>("LlmResponse") ?? string.Empty;
                data.SetProperty("FinalOutput", $"处理后的输出: {llmResponse}");
                return true;
            }
        };
        AddStep(processStep);
    }
}

/// <summary>
/// 内联函数步骤
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public class InlineFunctionStep<TData> : WorkflowStepBase<TData, InlineFunctionStepBody<TData>>
    where TData : WorkflowData, new()
{
    /// <summary>
    /// 执行函数
    /// </summary>
    public Func<IStepExecutionContext, TData, Task<bool>> Execute { get; set; } = null!;

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public override IStepBuilder<TData, IStepBody> ConfigureInput(IStepBuilder<TData, IStepBody> step)
    {
        var typedStep = StepBuilderConverter.ConvertToTyped<TData, InlineFunctionStepBody<TData>>(step);
        
        // 设置执行函数
        typedStep.Input(s => s.ExecuteFunction, _ => Execute);
        
        return StepBuilderConverter.ConvertToInterface<TData, InlineFunctionStepBody<TData>>(typedStep);
    }
}

/// <summary>
/// 内联函数步骤体
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public class InlineFunctionStepBody<TData> : IStepBody
    where TData : WorkflowData, new()
{
    /// <summary>
    /// 执行函数
    /// </summary>
    public Func<IStepExecutionContext, TData, Task<bool>> ExecuteFunction { get; set; } = null!;

    /// <summary>
    /// 执行步骤
    /// </summary>
    /// <param name="context">执行上下文</param>
    /// <returns>执行结果</returns>
    public async Task<ExecutionResult> RunAsync(IStepExecutionContext context)
    {
        try
        {
            if (ExecuteFunction == null)
            {
                return ExecutionResult.Next();
            }

            var data = context.Item as TData;
            if (data == null)
            {
                return ExecutionResult.Next();
            }

            bool result = await ExecuteFunction(context, data);
            return result ? ExecutionResult.Next() : ExecutionResult.Sleep(TimeSpan.FromSeconds(10), "执行失败");
        }
        catch (Exception ex)
        {
            return ExecutionResult.Sleep(TimeSpan.FromSeconds(10), ex.Message);
        }
    }
} 