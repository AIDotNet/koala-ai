using System.Linq.Expressions;
using Koala.Domain.WorkFlows.Definitions;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Application.WorkFlows.Steps;

/// <summary>
/// 条件分支步骤体
/// </summary>
public class ConditionalBranchStepBody : IStepBody
{
    /// <summary>
    /// 条件表达式
    /// </summary>
    public string Condition { get; set; } = string.Empty;

    /// <summary>
    /// 变量字典
    /// </summary>
    public Dictionary<string, object>? Variables { get; set; }

    /// <summary>
    /// 条件结果存储键
    /// </summary>
    public string? ResultKey { get; set; }

    /// <summary>
    /// 条件为真时的分支ID
    /// </summary>
    public string? TrueBranchId { get; set; }

    /// <summary>
    /// 条件为假时的分支ID
    /// </summary>
    public string? FalseBranchId { get; set; }

    /// <summary>
    /// 评估结果
    /// </summary>
    public bool EvaluationResult { get; set; }

    /// <summary>
    /// 执行步骤
    /// </summary>
    /// <param name="context">执行上下文</param>
    /// <returns>执行结果</returns>
    public async Task<ExecutionResult> RunAsync(IStepExecutionContext context)
    {
        try
        {
            // 评估条件表达式
            EvaluationResult = await EvaluateConditionAsync(Condition, Variables);

            // 如果有指定结果键，将结果存储到数据上下文中
            if (!string.IsNullOrEmpty(ResultKey) && context.PersistenceData is WorkflowData data)
            {
                data.SetProperty(ResultKey, EvaluationResult);
            }

            // 根据评估结果返回相应的outcome
            return EvaluationResult 
                ? ExecutionResult.Outcome("True") 
                : ExecutionResult.Outcome("False");
        }
        catch (Exception ex)
        {
            return ExecutionResult.Sleep(TimeSpan.FromSeconds(10), ex.Message);
        }
    }

    /// <summary>
    /// 评估条件表达式
    /// </summary>
    /// <param name="condition">条件表达式</param>
    /// <param name="variables">变量字典</param>
    /// <returns>评估结果</returns>
    private async Task<bool> EvaluateConditionAsync(string condition, Dictionary<string, object>? variables)
    {
        if (string.IsNullOrEmpty(condition))
            return false;

        try
        {
            // 在实际项目中，这里应该实现一个表达式解析和执行引擎
            // 可以使用DynamicExpresso、CodingSeb.ExpressionEvaluator等库
            // 以下是简化模拟逻辑

            // 先替换变量
            var processedCondition = condition;
            if (variables != null)
            {
                foreach (var variable in variables)
                {
                    processedCondition = processedCondition.Replace($"{{{{{variable.Key}}}}}", variable.Value?.ToString() ?? "null");
                }
            }

            // 简单模拟一些条件检查
            // 这只是为了演示，实际应该使用表达式解析库
            bool result = false;

            // 模拟简单比较语句
            if (processedCondition.Contains("=="))
            {
                var parts = processedCondition.Split("==", StringSplitOptions.TrimEntries);
                if (parts.Length == 2)
                {
                    result = string.Equals(parts[0], parts[1], StringComparison.OrdinalIgnoreCase);
                }
            }
            else if (processedCondition.Contains("!="))
            {
                var parts = processedCondition.Split("!=", StringSplitOptions.TrimEntries);
                if (parts.Length == 2)
                {
                    result = !string.Equals(parts[0], parts[1], StringComparison.OrdinalIgnoreCase);
                }
            }
            else if (processedCondition.Contains(">"))
            {
                var parts = processedCondition.Split(">", StringSplitOptions.TrimEntries);
                if (parts.Length == 2 && decimal.TryParse(parts[0], out var left) && decimal.TryParse(parts[1], out var right))
                {
                    result = left > right;
                }
            }
            else if (processedCondition.Contains("<"))
            {
                var parts = processedCondition.Split("<", StringSplitOptions.TrimEntries);
                if (parts.Length == 2 && decimal.TryParse(parts[0], out var left) && decimal.TryParse(parts[1], out var right))
                {
                    result = left < right;
                }
            }
            else if (processedCondition.ToLower() == "true")
            {
                result = true;
            }
            else if (processedCondition.ToLower() == "false")
            {
                result = false;
            }

            // 在真实实现中应使用await，此处模拟
            await Task.Delay(100);

            return result;
        }
        catch
        {
            // 如果评估失败，默认返回false
            return false;
        }
    }
} 