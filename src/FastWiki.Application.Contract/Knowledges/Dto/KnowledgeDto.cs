using FastWiki.Domain.Shared.Knowledge;

namespace FastWiki.Application.Contract.Knowledges.Dto;

public class KnowledgeDto
{
    public string Id { get; set; }
    public string Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public string? CategoryId { get; private set; }

    public KnowledgeRagType RagType { get; private set; }

    public string Avatar { get; private set; } = null!;

    /// <summary>
    /// 知识库向量模型
    /// </summary>
    public string EmbeddingModel { get; private set; } = null!;

    /// <summary>
    /// 知识库对话处理模型
    /// </summary>
    public string ChatModel { get; private set; } = null!;

    /// <summary>
    /// 工作空间Id
    /// 可空
    /// </summary>
    public long? WorkSpaceId { get; set; }
}