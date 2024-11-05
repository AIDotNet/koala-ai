using FastWiki.Application.Contract.Notification;
using FastWiki.Application.Contract.Notification.Dto;
using Lazy.Captcha.Core;

namespace FastWiki.Application.Notification;

public class NotificationService(ICaptcha captcha) : INotificationService, IScopeDependency
{
    public Task<VerificationDto> GetLoginVerificationCodeAsync()
    {
        var uuid = "login:" + Guid.NewGuid().ToString("N");

        var code = captcha.Generate(uuid, 240);

        return Task.FromResult(new VerificationDto
        {
            Key = uuid,
            Code = code.Base64
        });
    }

    public Task<string> GetRegisterVerificationCodeAsync(string account)
    {
        var uuid = "register:" + account;

        var code = captcha.Generate(uuid, 240);

        return Task.FromResult(code.Base64);
    }
}