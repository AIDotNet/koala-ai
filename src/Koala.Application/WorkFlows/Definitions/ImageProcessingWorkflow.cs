using System.Text.Json;
using Koala.Application.WorkFlows.Steps;
using Koala.Domain.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Steps;
using WorkflowCore.Interface;

namespace Koala.Application.WorkFlows.Definitions;

/// <summary>
/// 图像处理工作流数据
/// </summary>
public class ImageProcessingWorkflowData : WorkflowData
{
    public ImageProcessingWorkflowData()
    {
    }
    
    /// <summary>
    /// 图像URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// 处理类型
    /// </summary>
    public string ProcessingType { get; set; } = "analyze"; // analyze, caption, ocr

    /// <summary>
    /// 图像分析结果
    /// </summary>
    public string ImageAnalysisResult { get; set; } = string.Empty;

    /// <summary>
    /// LLM生成的描述
    /// </summary>
    public string Description { get; set; } = string.Empty;
}

/// <summary>
/// 图像处理步骤
/// </summary>
/// <typeparam name="TData">工作流数据类型</typeparam>
public class ImageProcessingStep<TData> : WorkflowStepBase<TData, ImageProcessingStepBody>
    where TData : WorkflowData, new()
{
    /// <summary>
    /// 图像处理步骤配置
    /// </summary>
    public class ImageProcessingStepConfig
    {
        /// <summary>
        /// 图像URL
        /// </summary>
        public string ImageUrl { get; set; } = string.Empty;

        /// <summary>
        /// 处理类型
        /// </summary>
        public string ProcessingType { get; set; } = "analyze";

        /// <summary>
        /// 变量映射
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
    private ImageProcessingStepConfig? _stepConfig;

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
            _stepConfig = JsonSerializer.Deserialize<ImageProcessingStepConfig>(Configuration);
        }
        catch (Exception)
        {
            // 配置解析失败，使用默认值
            _stepConfig = new ImageProcessingStepConfig();
        }
    }

    /// <summary>
    /// 配置输入参数
    /// </summary>
    /// <param name="step">步骤构建器</param>
    protected override void ConfigureInputInternal(IStepBuilder<TData, ImageProcessingStepBody> step)
    {
        // 确保配置已解析
        if (_stepConfig == null)
            ParseConfiguration();

        if (_stepConfig == null)
            return;

        // 设置基本参数
        step.Input(s => s.ImageUrl, _ => _stepConfig.ImageUrl)
            .Input(s => s.ProcessingType, _ => _stepConfig.ProcessingType)
            .Input(s => s.OutputKey, _ => _stepConfig.OutputKey);

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

/// <summary>
/// 图像处理工作流示例
/// </summary>
public class ImageProcessingWorkflow : WorkflowDefinitionBase<ImageProcessingWorkflowData>
{
    /// <summary>
    /// 工作流ID
    /// </summary>
    public override string Id => "ImageProcessingWorkflow";

    /// <summary>
    /// 工作流版本
    /// </summary>
    public override int Version => 1;

    /// <summary>
    /// 工作流描述
    /// </summary>
    public override string Description => "图像处理工作流，包含图像分析和LLM描述生成";

    /// <summary>
    /// 配置工作流步骤
    /// </summary>
    protected override void ConfigureSteps()
    {
        // 1. 图像处理步骤
        var imageProcessingStep = new ImageProcessingStep<ImageProcessingWorkflowData>
        {
            StepId = "ImageProcessing",
            Name = "图像处理",
            Configuration = JsonSerializer.Serialize(new ImageProcessingStep<ImageProcessingWorkflowData>.ImageProcessingStepConfig
            {
                ImageUrl = "{{ImageUrl}}",
                ProcessingType = "{{ProcessingType}}",
                VariableMappings = new Dictionary<string, string>
                {
                    ["ImageUrl"] = "ImageUrl",
                    ["ProcessingType"] = "ProcessingType"
                },
                OutputKey = "ImageAnalysisResult"
            })
        };
        AddStep(imageProcessingStep);

        // 2. LLM描述生成步骤
        var llmStep = new LlmCallStep<ImageProcessingWorkflowData>
        {
            StepId = "GenerateDescription",
            Name = "生成描述",
            Configuration = JsonSerializer.Serialize(new LlmCallStep<ImageProcessingWorkflowData>.LlmCallStepConfig
            {
                ModelName = "gpt-4o",
                PromptTemplate = "请根据以下图像分析结果生成简洁的描述：{{ImageAnalysisResult}}",
                Temperature = 0.7f,
                MaxTokens = 500,
                VariableMappings = new Dictionary<string, string>
                {
                    ["ImageAnalysisResult"] = "ImageAnalysisResult"
                },
                OutputKey = "Description"
            })
        };
        AddStep(llmStep);
    }
} 