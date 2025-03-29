using System.Text.Json;
using Koala.Domain.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Steps;
using WorkflowCore.Interface;
using WorkflowCore.Models;
using WorkflowCore.Primitives;

namespace Koala.Application.WorkFlows.Steps;

/// <summary>
/// 条件分支步骤
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public class ConditionalBranchStep<TData> : WorkflowStepBase<TData, ConditionalBranchStepBody>
    where TData : WorkflowData, new()
{
    /// <summary>
    /// 条件分支步骤配置
    /// </summary>
    public class ConditionalBranchStepConfig
    {
        /// <summary>
        /// 条件表达式
        /// </summary>
        public string Condition { get; set; } = string.Empty;

        /// <summary>
        /// 条件变量映射
        /// </summary>
        public Dictionary<string, string>? VariableMappings { get; set; }

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
    }

    /// <summary>
    /// 步骤配置
    /// </summary>
    private ConditionalBranchStepConfig? _stepConfig;

    /// <summary>
    /// 解析配置
    /// </summary>
    protected override void ParseConfiguration()
    {
        base.ParseConfiguration();

        if (string.IsNullOrEmpty(Configuration))
            return;

        try
        {
            _stepConfig = JsonSerializer.Deserialize<ConditionalBranchStepConfig>(Configuration);
        }
        catch (Exception)
        {
            // 配置解析失败，使用默认值
            _stepConfig = new ConditionalBranchStepConfig();
        }
    }

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    protected override void ConfigureInputInternal(IStepBuilder<TData, ConditionalBranchStepBody> step)
    {
        // 确保配置已解析
        if (_stepConfig == null)
            ParseConfiguration();

        if (_stepConfig == null)
            return;
        
        // 设置基本参数
        step.Input(s => s.Condition, _ => _stepConfig.Condition)
             .Input(s => s.ResultKey, _ => _stepConfig.ResultKey)
             .Input(s => s.TrueBranchId, _ => _stepConfig.TrueBranchId)
             .Input(s => s.FalseBranchId, _ => _stepConfig.FalseBranchId);

        // 设置变量映射
        if (_stepConfig.VariableMappings != null && _stepConfig.VariableMappings.Count > 0)
        {
            step.Input(s => s.Variables, ctx => GetVariables(ctx, _stepConfig.VariableMappings));
        }
    }

    /// <summary>
    /// 配置输出和下一步骤
    /// </summary>
    /// <param name="step">步骤构建器</param>
    protected override void ConfigureOutputInternal(IStepBuilder<TData, ConditionalBranchStepBody> step)
    {
        // 确保配置已解析
        if (_stepConfig == null)
            ParseConfiguration();

        if (_stepConfig == null)
            return;

        // 配置条件分支 - 当条件步骤执行后会返回"True"或"False"的outcome
        if (!string.IsNullOrEmpty(_stepConfig.TrueBranchId))
        {
            step.When("True").EndWorkflow();
        }

        if (!string.IsNullOrEmpty(_stepConfig.FalseBranchId))
        {
            step.When("False").EndWorkflow();
        }
    }

    /// <summary>
    /// 获取变量映射
    /// </summary>
    private Dictionary<string, object> GetVariables(TData data, Dictionary<string, string> mappings)
    {
        var variables = new Dictionary<string, object>();
        
        if (data != null)
        {
            foreach (var mapping in mappings)
            {
                // 从工作流数据中读取变量值
                var value = data.GetProperty<object>(mapping.Value);
                if (value != null)
                {
                    variables[mapping.Key] = value;
                }
            }
        }
        
        return variables;
    }

    public override Type BodyType { get; }
} 