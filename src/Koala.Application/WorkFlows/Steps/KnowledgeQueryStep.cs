using System.Text.Json;
using Koala.Domain.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Steps;
using WorkflowCore.Interface;

namespace Koala.Application.WorkFlows.Steps;

/// <summary>
/// 知识库查询步骤
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public class KnowledgeQueryStep<TData> : WorkflowStepBase<TData, KnowledgeQueryStepBody>
    where TData : WorkflowData, new()
{
    /// <summary>
    /// 知识库查询步骤配置
    /// </summary>
    public class KnowledgeQueryStepConfig
    {
        /// <summary>
        /// 知识库ID
        /// </summary>
        public string KnowledgeBaseId { get; set; } = string.Empty;

        /// <summary>
        /// 查询模板
        /// </summary>
        public string QueryTemplate { get; set; } = string.Empty;

        /// <summary>
        /// 检索条数
        /// </summary>
        public int TopK { get; set; } = 5;

        /// <summary>
        /// 相似度阈值
        /// </summary>
        public float SimilarityThreshold { get; set; } = 0.7f;

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
    private KnowledgeQueryStepConfig? _stepConfig;

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
            _stepConfig = JsonSerializer.Deserialize<KnowledgeQueryStepConfig>(Configuration);
        }
        catch (Exception)
        {
            // 配置解析失败，使用默认值
            _stepConfig = new KnowledgeQueryStepConfig();
        }
    }

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    protected override void ConfigureInputInternal(IStepBuilder<TData, KnowledgeQueryStepBody> step)
    {
        // 确保配置已解析
        if (_stepConfig == null)
            ParseConfiguration();

        if (_stepConfig == null)
            return;
        
        // 设置基本参数
        step.Input(s => s.KnowledgeBaseId, ctx => _stepConfig.KnowledgeBaseId)
             .Input(s => s.Query, ctx => _stepConfig.QueryTemplate)
             .Input(s => s.TopK, ctx => _stepConfig.TopK)
             .Input(s => s.SimilarityThreshold, ctx => _stepConfig.SimilarityThreshold)
             .Input(s => s.OutputKey, ctx => _stepConfig.OutputKey);

        // 设置变量映射
        if (_stepConfig.VariableMappings != null && _stepConfig.VariableMappings.Count > 0)
        {
            step.Input(s => s.Variables, ctx => GetVariables(ctx, _stepConfig.VariableMappings));
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