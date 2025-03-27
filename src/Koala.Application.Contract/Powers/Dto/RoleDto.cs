namespace Koala.Application.Contract.Powers.Dto;

public class RoleDto
{
    public string Id { get; set; }
    /// <summary>
    /// 角色名称
    /// </summary>
    public string Name { get;  set; } = null!;

    /// <summary>
    /// 描述
    /// </summary>
    public string Description { get;  set; } = null!;

    /// <summary>
    /// 编码
    /// </summary>
    public string Code { get;  set; }

}