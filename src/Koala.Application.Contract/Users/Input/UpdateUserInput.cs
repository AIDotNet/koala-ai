namespace Koala.Application.Contract.Users.Input;

public class UpdateUserInput
{
    /// <summary>
    ///     昵称
    /// </summary>
    public string Name { get; private set; }

    /// <summary>
    ///     邮箱
    /// </summary>
    public string Email { get; private set; }


    /// <summary>
    ///    个人简介
    /// </summary>
    public string Introduction { get; private set; }
}