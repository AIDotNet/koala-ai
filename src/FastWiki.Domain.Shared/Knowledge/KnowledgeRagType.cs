using System.ComponentModel;

namespace FastWiki.Domain.Shared.Knowledge;

/// <summary>
/// 知识库Rag类型
/// </summary>
public enum KnowledgeRagType : byte
{
    /// <summary>
    /// 正常Rag模式
    /// </summary>
    [Description("普通知识库")]
    DefaultRag = 0,

    /// <summary>
    /// Mem0 Rag
    /// </summary>
    [Description("Mem0知识库")]
    Mem0Rag = 10
}