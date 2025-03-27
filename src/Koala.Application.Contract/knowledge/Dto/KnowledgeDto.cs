using Koala.Core.Extensions;
using Koala.Domain.Shared.Knowledge;

namespace Koala.Application.Contract.knowledge.Dto;

public class KnowledgeDto
{
    public string Id { get; set; }
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? CategoryId { get;  set; }

    public KnowledgeRagType RagType { get; set; }

    public string RagTypeName => RagType.GetDescription();


    public string Avatar { get;     set; } = null!;

    /// <summary>
    /// 知识库向量模型
    /// </summary>
    public string EmbeddingModel { get; set; } = null!;

    /// <summary>
    /// 知识库对话处理模型
    /// </summary>
    public string ChatModel { get; set; } = null!;

    /// <summary>
    /// 工作空间Id
    /// 可空
    /// </summary>
    public long? WorkSpaceId { get; set; }
}