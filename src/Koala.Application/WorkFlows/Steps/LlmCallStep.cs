using System.Text.Json;
using Koala.Application.WorkFlows.Steps;
using Koala.Domain.WorkFlows.Definitions;
using WorkflowCore.Interface;

namespace Koala.Domain.WorkFlows.Steps;

/// <summary>
/// LLM调用步骤
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public class LlmCallStep<TData> : WorkflowStepBase<TData, LlmCallStepBody>
    where TData : WorkflowData, new()
{
    /// <summary>
    /// LLM调用步骤配置
    /// </summary>
    public class LlmCallStepConfig
    {
        /// <summary>
        /// 模型名称
        /// </summary>
        public string ModelName { get; set; } = string.Empty;

        /// <summary>
        /// 提示词模板
        /// </summary>
        public string PromptTemplate { get; set; } = string.Empty;

        /// <summary>
        /// 温度
        /// </summary>
        public float Temperature { get; set; } = 0.7f;

        /// <summary>
        /// 最大生成长度
        /// </summary>
        public int MaxTokens { get; set; } = 2000;

        /// <summary>
        /// 输入变量映射
        /// </summary>
        public Dictionary<string, string>? VariableMappings { get; set; }

        /// <summary>
        /// 输出结果存储键
        /// </summary>
        public string? OutputKey { get; set; }
    }

    /// <summary>
    /// 步骤配置
    /// </summary>
    private LlmCallStepConfig? _stepConfig;

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
            _stepConfig = JsonSerializer.Deserialize<LlmCallStepConfig>(Configuration);
        }
        catch (Exception)
        {
            // 配置解析失败，使用默认值
            _stepConfig = new LlmCallStepConfig();
        }
    }

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public override IStepBuilder<TData, IStepBody> ConfigureInput(IStepBuilder<TData, IStepBody> step)
    {
        // 确保配置已解析
        if (_stepConfig == null)
            ParseConfiguration();

        if (_stepConfig == null)
            return step;

        // 需要先进行类型转换，因为步骤构建器接口使用的是基础接口而非具体类型
        // 使用泛型转换助手来实现正确的类型处理
        var typedStep = StepBuilderConverter.ConvertToTyped<TData, LlmCallStepBody>(step);
        
        // 设置基本参数
        typedStep.Input(s => s.ModelName, ctx => _stepConfig.ModelName)
                 .Input(s => s.Prompt, ctx => _stepConfig.PromptTemplate)
                 .Input(s => s.Temperature, ctx => _stepConfig.Temperature)
                 .Input(s => s.MaxTokens, ctx => _stepConfig.MaxTokens)
                 .Input(s => s.OutputKey, ctx => _stepConfig.OutputKey);

        // 设置变量映射
        if (_stepConfig.VariableMappings != null && _stepConfig.VariableMappings.Count > 0)
        {
            typedStep.Input(s => s.Variables, ctx => GetVariables(ctx, _stepConfig.VariableMappings));
        }

        // 转换回原始接口类型
        return StepBuilderConverter.ConvertToInterface<TData, LlmCallStepBody>(typedStep);
    }

    /// <summary>
    /// 配置输出参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    /// <returns>步骤构建器</returns>
    public override IStepBuilder<TData, IStepBody> ConfigureOutput(IStepBuilder<TData, IStepBody> step)
    {
        // 确保配置已解析
        if (_stepConfig == null)
            ParseConfiguration();

        if (_stepConfig == null || string.IsNullOrEmpty(_stepConfig.OutputKey))
            return step;

        // 此处暂时不实现自动输出映射，由 LlmCallStepBody 中的 RunAsync 方法手动处理输出
        // 可通过修改 WorkflowData 类来引入事件总线或回调函数实现输出处理

        return step;
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
}

/// <summary>
/// 步骤构建器转换助手
/// </summary>
public static class StepBuilderConverter
{
    /// <summary>
    /// 将接口类型转换为具体步骤类型
    /// </summary>
    public static IStepBuilder<TData, TStepBody> ConvertToTyped<TData, TStepBody>(IStepBuilder<TData, IStepBody> step)
        where TData : class, new()
        where TStepBody : IStepBody
    {
        // 在实际项目中，这里可能需要更复杂的转换逻辑，取决于WorkflowCore的具体实现
        // 此处简单演示，实际使用时可能需要调整
        return step as IStepBuilder<TData, TStepBody>;
    }

    /// <summary>
    /// 将具体步骤类型转换为接口类型
    /// </summary>
    public static IStepBuilder<TData, IStepBody> ConvertToInterface<TData, TStepBody>(IStepBuilder<TData, TStepBody> step)
        where TData : class, new()
        where TStepBody : IStepBody
    {
        // 在实际项目中，这里可能需要更复杂的转换逻辑，取决于WorkflowCore的具体实现
        // 此处简单演示，实际使用时可能需要调整
        return step as IStepBuilder<TData, IStepBody>;
    }
} 