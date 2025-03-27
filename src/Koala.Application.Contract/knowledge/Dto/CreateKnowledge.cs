using Koala.Domain.Shared.Knowledge;

namespace Koala.Application.Contract.knowledge.Dto;
public class CreateKnowledge
{
    public string Name { get;  set; } 

    public string? Description { get;  set; }

    public string? CategoryId { get;  set; }

    public KnowledgeRagType RagType { get;  set; }

    public string Avatar { get; set; } 

    /// <summary>
    /// 知识库向量模型
    /// </summary>
    public string EmbeddingModel { get; set; } 

    /// <summary>
    /// 知识库对话处理模型
    /// </summary>
    public string ChatModel { get; set; } 

    /// <summary>
    /// 工作空间Id
    /// 可空
    /// </summary>
    public long WorkspaceId { get; set; }
}
