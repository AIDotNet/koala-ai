using FastWiki.Domain.Shared.WorkSpaces;

namespace FastWiki.Application.Contract.WorkSpaces.Dto;

public class WorkSpaceDto
{
    public long Id { get; set; }

    /// <summary>
    /// 工作空间名称
    /// </summary>
    /// <returns></returns>
    public string Name { get; set; } = null!;

    /// <summary>
    /// 工作空间描述
    /// </summary>
    /// <returns></returns>
    public string? Description { get; set; }

    /// <summary>
    /// 工作空间状态
    /// </summary>
    public WorkSpaceState State { get; set; }
}