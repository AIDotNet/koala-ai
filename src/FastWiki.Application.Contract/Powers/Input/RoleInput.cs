namespace FastWiki.Application.Contract.Powers.Input;

public class RoleInput
{
    /// <summary>
    /// 角色名称
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// 描述
    /// </summary>
    public string Description { get; set; } = null!;

    /// <summary>
    /// 编码
    /// </summary>
    public string Code { get; set; }
}