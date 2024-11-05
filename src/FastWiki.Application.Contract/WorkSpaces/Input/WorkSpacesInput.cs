namespace FastWiki.Application.Contract.WorkSpaces.Input;

public class WorkSpacesInput
{
    /// <summary>
    /// 工作空间名称
    /// </summary>
    /// <returns></returns>
    public string Name { get;  set; } = null!;

    /// <summary>
    /// 工作空间描述
    /// </summary>
    /// <returns></returns>
    public string? Description { get;  set; }

}