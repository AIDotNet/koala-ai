using FastWiki.Application.Contract.Notification.Dto;

namespace FastWiki.Application.Contract.Notification;

public interface INotificationService
{
    /// <summary>
    /// 获取登录验证码
    /// </summary>
    /// <returns></returns>
    Task<VerificationDto> GetLoginVerificationCodeAsync();

    /// <summary>
    /// 获取注册验证码
    /// </summary>
    /// <param name="account"></param>
    /// <returns></returns>
    Task<string> GetRegisterVerificationCodeAsync(string account);
}