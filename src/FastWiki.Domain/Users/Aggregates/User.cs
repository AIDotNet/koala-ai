namespace FastWiki.Domain.Users.Aggregates;

public class User : AuditEntity<string>
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
    /// 密码盐
    /// </summary>
    public string Salt { get; private set; }

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

    public string Introduction { get; private set; }

    /// <summary>
    ///     是否禁用
    /// </summary>
    public bool IsDisable { get; private set; }


    public User(string account, string name, string password, string email, string phone, string introduction)
    {
        Account = account;
        SetName(name);
        SetPassword(password);
        SetEmail(email);
        SetPhone(phone);
        SetIntroduction(introduction);
        Avatar = "\ud83e\udd9d";
        IsDisable = false;
    }

    protected User()
    {
    }

    public void Disable()
    {
        IsDisable = true;
    }

    public void Enable()
    {
        IsDisable = false;
    }

    public void SetPassword(string password)
    {
        Salt = Guid.NewGuid().ToString("N");
        Password = Md5Helper.HashPassword(password, Salt);
    }

    public void SetEmail(string email)
    {
        // 使用正则表达式验证邮箱
        var regex = new Regex(@"^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$");
        if (!regex.IsMatch(email)) throw new ArgumentException("邮箱格式不正确");

        Email = email;
    }

    public void SetPhone(string phone)
    {
        // 使用正则表达式验证手机号
        var regex = new Regex(@"^1[3456789]\d{9}$");
        if (!regex.IsMatch(phone)) throw new ArgumentException("手机号格式不正确");

        Phone = phone;
    }

    public void SetIntroduction(string introduction)
    {
        Introduction = introduction;
    }

    public void SetName(string name)
    {
        Name = name;
    }

    /// <summary>
    ///     校验密码
    /// </summary>
    /// <param name="password"></param>
    /// <returns></returns>
    public bool CheckCipher(string password)
    {
        return Password == Md5Helper.HashPassword(password, Salt);
    }
}