namespace FastWiki.Application.Contract.Users.Dto;

public class UserDto
{
    public string Id { get; set; }
    
    /// <summary>
    ///     账户
    /// </summary>
    public string Account { get; set; }

    /// <summary>
    ///     昵称
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    ///     密码
    /// </summary>
    public string Password { get; set; }

    /// <summary>
    /// 密码盐
    /// </summary>
    public string Salt { get; set; }

    /// <summary>
    ///     头像
    /// </summary>
    public string Avatar { get; set; }

    /// <summary>
    ///     邮箱
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    ///     手机号
    /// </summary>
    public string Phone { get; set; }

    public string Introduction { get; set; }

    /// <summary>
    ///     是否禁用
    /// </summary>
    public bool IsDisable { get; set; }
}