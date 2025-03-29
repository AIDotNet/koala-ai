using System.Text.Json;
using Koala.Application.WorkFlows.Definitions;
using Koala.Application.WorkFlows.Steps;
using Koala.Domain.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Steps;

namespace Koala.Application.WorkFlows.Definitions;

/// <summary>
/// 知识库查询工作流数据
/// </summary>
public class KnowledgeQueryWorkflowData : WorkflowData
{
    public KnowledgeQueryWorkflowData()
    {
    }
    
    /// <summary>
    /// 用户问题
    /// </summary>
    public string UserQuestion { get; set; } = string.Empty;

    /// <summary>
    /// 知识库ID
    /// </summary>
    public string KnowledgeBaseId { get; set; } = string.Empty;

    /// <summary>
    /// 知识库查询结果
    /// </summary>
    public List<KnowledgeQueryStepBody.SearchResult>? QueryResults { get; set; }

    /// <summary>
    /// LLM响应
    /// </summary>
    public string LlmResponse { get; set; } = string.Empty;

    /// <summary>
    /// 最终回复
    /// </summary>
    public string FinalAnswer { get; set; } = string.Empty;
}

/// <summary>
/// 知识库查询工作流示例
/// </summary>
public class KnowledgeQueryWorkflow : WorkflowDefinitionBase<KnowledgeQueryWorkflowData>
{
    /// <summary>
    /// 工作流ID
    /// </summary>
    public override string Id => "KnowledgeQueryWorkflow";

    /// <summary>
    /// 工作流版本
    /// </summary>
    public override int Version => 1;

    /// <summary>
    /// 工作流描述
    /// </summary>
    public override string Description => "知识库查询工作流，包含知识库查询和LLM调用步骤";

    /// <summary>
    /// 配置工作流步骤
    /// </summary>
    protected override void ConfigureSteps()
    {
        // 1. 知识库查询步骤
        var queryStep = new KnowledgeQueryStep<KnowledgeQueryWorkflowData>
        {
            StepId = "KnowledgeQuery",
            Name = "知识库查询",
            Configuration = JsonSerializer.Serialize(new KnowledgeQueryStep<KnowledgeQueryWorkflowData>.KnowledgeQueryStepConfig
            {
                KnowledgeBaseId = "{{KnowledgeBaseId}}",
                QueryTemplate = "{{UserQuestion}}",
                TopK = 5,
                SimilarityThreshold = 0.7f,
                VariableMappings = new Dictionary<string, string>
                {
                    ["UserQuestion"] = "UserQuestion",
                    ["KnowledgeBaseId"] = "KnowledgeBaseId"
                },
                OutputKey = "QueryResults"
            })
        };
        AddStep(queryStep);

        // 2. 条件分支步骤 - 检查是否有查询结果
        var conditionStep = new ConditionalBranchStep<KnowledgeQueryWorkflowData>
        {
            StepId = "CheckResults",
            Name = "检查查询结果",
            Configuration = JsonSerializer.Serialize(new ConditionalBranchStep<KnowledgeQueryWorkflowData>.ConditionalBranchStepConfig
            {
                Condition = "{{HasResults}} == true",
                VariableMappings = new Dictionary<string, string>
                {
                    ["HasResults"] = "HasQueryResults" // 这个需要通过前处理获取
                },
                ResultKey = "HasValidResults",
                TrueBranchId = "WithKnowledge",
                FalseBranchId = "WithoutKnowledge"
            })
        };
        
        // 2.1 添加预处理步骤来检查结果
        var preCheckStep = new InlineFunctionStep<KnowledgeQueryWorkflowData>
        {
            StepId = "PreCheckResults",
            Name = "预处理检查结果",
            Execute = async (context, data) =>
            {
                var results = data.GetProperty<List<KnowledgeQueryStepBody.SearchResult>>("QueryResults");
                bool hasResults = results != null && results.Count > 0;
                data.SetProperty("HasQueryResults", hasResults);
                return true;
            }
        };
        AddStep(preCheckStep);
        AddStep(conditionStep);

        // 3.1 有知识库结果的分支 - LLM调用（带知识）
        var withKnowledgeStep = new LlmCallStep<KnowledgeQueryWorkflowData>
        {
            StepId = "WithKnowledge",
            Name = "LLM调用（带知识）",
            Configuration = JsonSerializer.Serialize(new LlmCallStep<KnowledgeQueryWorkflowData>.LlmCallStepConfig
            {
                ModelName = "gpt-4o",
                PromptTemplate = "根据以下知识库内容，回答用户问题：\n\n用户问题：{{UserQuestion}}\n\n知识库内容：\n{{KnowledgeContent}}\n\n请提供准确、全面的回答。如果知识库中没有相关信息，请说明无法回答并给出建议。",
                Temperature = 0.3f,
                MaxTokens = 1000,
                VariableMappings = new Dictionary<string, string>
                {
                    ["UserQuestion"] = "UserQuestion",
                    ["KnowledgeContent"] = "FormattedResults" // 这个需要通过前处理获取
                },
                OutputKey = "LlmResponse"
            })
        };
        
        // 3.1.1 添加预处理步骤格式化知识库结果
        var formatResultsStep = new InlineFunctionStep<KnowledgeQueryWorkflowData>
        {
            StepId = "FormatResults",
            Name = "格式化知识库结果",
            Execute = async (context, data) =>
            {
                var results = data.GetProperty<List<KnowledgeQueryStepBody.SearchResult>>("QueryResults");
                if (results == null || results.Count == 0)
                {
                    data.SetProperty("FormattedResults", "未找到相关知识");
                    return true;
                }

                // 格式化知识库结果为文本
                var formattedResults = new System.Text.StringBuilder();
                for (int i = 0; i < results.Count; i++)
                {
                    formattedResults.AppendLine($"{i + 1}. {results[i].Content}");
                    formattedResults.AppendLine($"   来源: {results[i].Source}");
                    formattedResults.AppendLine();
                }

                data.SetProperty("FormattedResults", formattedResults.ToString());
                return true;
            }
        };
        
        // 3.2 无知识库结果的分支 - LLM调用（无知识）
        var withoutKnowledgeStep = new LlmCallStep<KnowledgeQueryWorkflowData>
        {
            StepId = "WithoutKnowledge",
            Name = "LLM调用（无知识）",
            Configuration = JsonSerializer.Serialize(new LlmCallStep<KnowledgeQueryWorkflowData>.LlmCallStepConfig
            {
                ModelName = "gpt-4o",
                PromptTemplate = "用户问题：{{UserQuestion}}\n\n我需要回答用户的问题，但在知识库中未找到相关信息。请给出礼貌的回复，说明无法提供准确答案，并建议用户尝试重新表述问题或联系客服获取更多帮助。",
                Temperature = 0.7f,
                MaxTokens = 500,
                VariableMappings = new Dictionary<string, string>
                {
                    ["UserQuestion"] = "UserQuestion"
                },
                OutputKey = "LlmResponse"
            })
        };
        
        // 添加格式化结果步骤
        AddStep(formatResultsStep);
        
        // 添加两个分支步骤
        AddStep(withKnowledgeStep);
        AddStep(withoutKnowledgeStep);

        // 4. 最终处理步骤 - 整理输出
        var finalStep = new InlineFunctionStep<KnowledgeQueryWorkflowData>
        {
            StepId = "FinalStep",
            Name = "整理输出",
            Execute = async (context, data) =>
            {
                var llmResponse = data.GetProperty<string>("LlmResponse") ?? string.Empty;
                data.SetProperty("FinalAnswer", llmResponse);
                return true;
            }
        };
        AddStep(finalStep);
    }
} 