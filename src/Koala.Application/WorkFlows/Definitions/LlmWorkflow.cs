using System.Text.Json;
using Koala.Application.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Steps;
using WorkflowCore.Interface;

namespace Koala.Application.WorkFlows.Definitions;

/// <summary>
/// LLM工作流数据
/// </summary>
public class LlmWorkflowData : WorkflowData
{
    /// <summary>
    /// 输入提示
    /// </summary>
    public string Prompt { get; set; } = string.Empty;

    /// <summary>
    /// LLM输出结果
    /// </summary>
    public string Output { get; set; } = string.Empty;
}

/// <summary>
/// LLM工作流
/// 一个简单的工作流，接收输入提示，通过LLM处理后输出结果
/// </summary>
public class LlmWorkflow : WorkflowDefinitionBase<LlmWorkflowData>, IWorkflow<LlmWorkflowData>
{
    /// <summary>
    /// 工作流ID
    /// </summary>
    public override string Id => "LlmWorkflow";

    /// <summary>
    /// 工作流版本
    /// </summary>
    public override int Version => 1;

    /// <summary>
    /// 工作流描述
    /// </summary>
    public override string Description => "LLM工作流，接收输入提示，通过LLM处理后输出结果";

    /// <summary>
    /// 配置工作流步骤
    /// </summary>
    protected override void ConfigureSteps()
    {
        // LLM调用步骤
        var llmCallStep = new LlmCallStep<LlmWorkflowData>
        {
            StepId = "LlmCall",
            Name = "LLM调用",
            Configuration = JsonSerializer.Serialize(new LlmCallStep<LlmWorkflowData>.LlmCallStepConfig
            {
                ModelName = "gpt-4o", // 使用JSON中指定的模型
                PromptTemplate = "{{Prompt}}", // 直接使用输入的提示
                Temperature = 0.7f,
                MaxTokens = 1000,
                VariableMappings = new Dictionary<string, string>
                {
                    ["Prompt"] = "Prompt" // 将工作流数据中的Prompt映射到LLM调用的Prompt变量
                },
                OutputKey = "Output" // 将LLM输出保存到工作流数据的Output属性
            })
        };
        
        AddStep(llmCallStep);
    }

    /// <summary>
    /// 实现WorkflowCore.Interface.IWorkflow接口的Build方法
    /// </summary>
    /// <param name="builder">工作流构建器</param>
    void WorkflowCore.Interface.IWorkflow<LlmWorkflowData>.Build(IWorkflowBuilder<LlmWorkflowData> builder)
    {
        // 调用基类的Build方法
        base.Build(builder);
    }
} 