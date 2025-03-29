using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Application.WorkFlows.Steps;

/// <summary>
/// 知识库查询步骤体
/// </summary>
public class KnowledgeQueryStepBody : IStepBody
{
    /// <summary>
    /// 知识库ID
    /// </summary>
    public string KnowledgeBaseId { get; set; } = string.Empty;

    /// <summary>
    /// 查询文本
    /// </summary>
    public string Query { get; set; } = string.Empty;

    /// <summary>
    /// 检索条数
    /// </summary>
    public int TopK { get; set; } = 5;

    /// <summary>
    /// 相似度阈值
    /// </summary>
    public float SimilarityThreshold { get; set; } = 0.7f;

    /// <summary>
    /// 查询结果
    /// </summary>
    public List<SearchResult> Results { get; set; } = new List<SearchResult>();

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
            // 替换查询中的变量
            var processedQuery = ReplaceVariables(Query, Variables);

            // 这里是知识库查询逻辑，实际项目中需要替换为真实的API调用
            Results = await SimulateKnowledgeQueryAsync(KnowledgeBaseId, processedQuery, TopK, SimilarityThreshold);

            // 如果有指定输出键，将结果存储到数据上下文中
            if (!string.IsNullOrEmpty(OutputKey) && context.PersistenceData is Koala.Domain.WorkFlows.Definitions.WorkflowData data)
            {
                data.SetProperty(OutputKey, Results);
            }

            return ExecutionResult.Next();
        }
        catch (Exception ex)
        {
            return ExecutionResult.Sleep(TimeSpan.FromSeconds(10), ex.Message);
        }
    }

    /// <summary>
    /// 替换查询中的变量
    /// </summary>
    /// <param name="template">查询模板</param>
    /// <param name="variables">变量字典</param>
    /// <returns>处理后的查询</returns>
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
    /// 模拟知识库查询（实际项目中应替换为真实API调用）
    /// </summary>
    /// <param name="knowledgeBaseId">知识库ID</param>
    /// <param name="query">查询文本</param>
    /// <param name="topK">检索条数</param>
    /// <param name="similarityThreshold">相似度阈值</param>
    /// <returns>查询结果</returns>
    private async Task<List<SearchResult>> SimulateKnowledgeQueryAsync(string knowledgeBaseId, string query, int topK, float similarityThreshold)
    {
        // 模拟API调用延迟
        await Task.Delay(500);

        // 返回模拟结果
        var results = new List<SearchResult>();
        for (int i = 0; i < Math.Min(topK, 5); i++)
        {
            results.Add(new SearchResult
            {
                Id = $"doc_{i + 1}",
                Content = $"这是来自知识库 {knowledgeBaseId} 的第 {i + 1} 条结果，与查询 \"{query}\" 相关。",
                Source = $"source_{i + 1}",
                Similarity = similarityThreshold - (0.05f * i)
            });
        }

        return results;
    }

    /// <summary>
    /// 知识库搜索结果
    /// </summary>
    public class SearchResult
    {
        /// <summary>
        /// 文档ID
        /// </summary>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// 文档内容
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// 文档来源
        /// </summary>
        public string Source { get; set; } = string.Empty;

        /// <summary>
        /// 相似度
        /// </summary>
        public float Similarity { get; set; }
    }
} 