namespace FastWiki.Domain.Powers.Aggregates;

/// <summary>
/// 权限角色
/// </summary>
public class Role : AuditEntity<string>
{
    /// <summary>
    /// 角色名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 描述
    /// </summary>
    public string Description { get; private set; } = null!;

    /// <summary>
    /// 编码
    /// </summary>
    public string Code { get; private set; }

    public Role(string name, string description, string code)
    {
        SetName(name);
        SetDescription(description);
        SetCode(code);
    }

    public void SetName(string name)
    {
        // 校验角色名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("角色名称不能为空");
        }

        if (name.Length > 20)
        {
            throw new ArgumentException("角色名称长度不能超过20");
        }

        Name = name;
    }

    public void SetDescription(string description)
    {
        // 校验角色名称
        if (description.IsNullOrEmpty())
        {
            throw new ArgumentException("角色描述不能为空");
        }

        if (description.Length > 200)
        {
            throw new ArgumentException("角色描述长度不能超过200");
        }

        Description = description;
    }

    public void SetCode(string code)
    {
        // 校验角色编码
        if (code.IsNullOrEmpty())
        {
            throw new ArgumentException("角色编码不能为空");
        }

        if (code.Length > 20)
        {
            throw new ArgumentException("角色编码长度不能超过20");
        }

        Code = code;
    }

    protected Role()
    {
    }
}