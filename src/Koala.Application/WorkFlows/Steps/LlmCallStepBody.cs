using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Application.WorkFlows.Steps;

/// <summary>
/// LLM调用步骤体
/// </summary>
public class LlmCallStepBody : IStepBody
{
    /// <summary>
    /// 模型名称
    /// </summary>
    public string ModelName { get; set; } = string.Empty;

    /// <summary>
    /// 提示词
    /// </summary>
    public string Prompt { get; set; } = string.Empty;

    /// <summary>
    /// 温度
    /// </summary>
    public float Temperature { get; set; } = 0.7f;

    /// <summary>
    /// 最大生成长度
    /// </summary>
    public int MaxTokens { get; set; } = 2000;

    /// <summary>
    /// 输出结果
    /// </summary>
    public string Output { get; set; } = string.Empty;

    /// <summary>
    /// 输入变量替换
    /// </summary>
    public Dictionary<string, object>? Variables { get; set; }

    /// <summary>
    /// 输出结果存储键
    /// </summary>
    public string? OutputKey { get; set; }

    /// <summary>
    /// 执行步骤
    /// </summary>
    /// <param name="context">执行上下文</param>
    /// <returns>执行结果</returns>
    public async Task<ExecutionResult> RunAsync(IStepExecutionContext context)
    {
        try
        {
            // 替换提示词中的变量
            var processedPrompt = ReplaceVariables(Prompt, Variables);

            // 这里是LLM调用逻辑，实际项目中需要替换为真实的API调用
            // 示例实现仅作演示
            Output = await SimulateLlmCallAsync(ModelName, processedPrompt, Temperature, MaxTokens);

            // 如果有指定输出键，将结果存储到数据上下文中
            if (!string.IsNullOrEmpty(OutputKey) && context.PersistenceData is Koala.Domain.WorkFlows.Definitions.WorkflowData data)
            {
                data.SetProperty(OutputKey, Output);
            }

            return ExecutionResult.Next();
        }
        catch (Exception ex)
        {
            return ExecutionResult.Sleep(TimeSpan.FromSeconds(10), ex.Message);
        }
    }

    /// <summary>
    /// 替换提示词中的变量
    /// </summary>
    /// <param name="template">提示词模板</param>
    /// <param name="variables">变量字典</param>
    /// <returns>处理后的提示词</returns>
    private string ReplaceVariables(string template, Dictionary<string, object>? variables)
    {
        if (variables == null || variables.Count == 0)
            return template;

        var result = template;
        foreach (var variable in variables)
        {
            result = result.Replace($"{{{{{variable.Key}}}}}", variable.Value?.ToString() ?? string.Empty);
        }

        return result;
    }

    /// <summary>
    /// 模拟LLM调用（实际项目中应替换为真实API调用）
    /// </summary>
    /// <param name="modelName">模型名称</param>
    /// <param name="prompt">提示词</param>
    /// <param name="temperature">温度</param>
    /// <param name="maxTokens">最大生成长度</param>
    /// <returns>生成结果</returns>
    private async Task<string> SimulateLlmCallAsync(string modelName, string prompt, float temperature, int maxTokens)
    {
        // 模拟API调用延迟
        await Task.Delay(1000);

        // 返回模拟结果
        return $"这是来自模型 {modelName} 的回复，基于提示词: {prompt.Substring(0, Math.Min(50, prompt.Length))}...";
    }
} 