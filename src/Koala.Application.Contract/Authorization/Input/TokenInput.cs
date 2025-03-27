namespace Koala.Application.Contract.Authorization.Input;

public class TokenInput
{
    /// <summary>
    /// 用户名
    /// </summary>
    public string UserName { get; set; }
    
    /// <summary>
    /// 密码
    /// </summary>
    public string Password { get; set; }
    
    /// <summary>
    /// 验证码
    /// </summary>
    public string? Captcha { get; set; }
    
    /// <summary>
    /// 验证码Key
    /// </summary>
    public string? CaptchaKey { get; set; }
}