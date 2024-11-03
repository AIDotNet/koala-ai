namespace FastWiki.Domain.Shared.Knowledge;

/// <summary>
/// 知识库Rag类型
/// </summary>
public enum KnowledgeRagType : byte
{
    /// <summary>
    /// 正常Rag模式
    /// </summary>
    DefaultRag = 1,

    /// <summary>
    /// Mem0 Rag
    /// </summary>
    Mem0Rag = 2
}