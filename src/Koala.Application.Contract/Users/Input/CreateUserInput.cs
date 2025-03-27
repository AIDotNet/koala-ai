namespace Koala.Application.Contract.Users.Input;

public class CreateUserInput
{
    /// <summary>
    ///     账户
    /// </summary>
    public string Account { get; private set; }

    /// <summary>
    ///     昵称
    /// </summary>
    public string Name { get; private set; }

    /// <summary>
    ///     密码
    /// </summary>
    public string Password { get; private set; }

    /// <summary>
    ///     头像
    /// </summary>
    public string Avatar { get; private set; }

    /// <summary>
    ///     邮箱
    /// </summary>
    public string Email { get; private set; }

    /// <summary>
    ///     手机号
    /// </summary>
    public string Phone { get; private set; }

    /// <summary>
    ///    个人简介
    /// </summary>
    public string Introduction { get; private set; }

}