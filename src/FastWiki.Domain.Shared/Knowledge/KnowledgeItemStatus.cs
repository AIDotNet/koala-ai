using System.ComponentModel;

namespace FastWiki.Domain.Shared.Knowledge;

public enum KnowledgeItemStatus
{
    /// <summary>
    /// 执行中
    /// </summary>
    [Description("执行中")]
    Normal = 0,

    /// <summary>
    /// 可用
    /// </summary>
    [Description("可用")]
    Usable = 1,

    /// <summary>
    /// 失败
    /// </summary>
    [Description("失败")]
    Fail = 99
}
