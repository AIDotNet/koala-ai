using Lazy.Captcha.Core;

namespace FastWiki.Application.Authorization;

public class AuthorizationService(
    JwtService jwtService,
    IUserRepository userRepository,
    ICaptcha captcha,
    IRoleRepository roleRepository)
    : IAuthorizationService, IScopeDependency
{
    public async Task<string> TokenAsync(TokenInput input)
    {
        // 校验验证码
        if (!string.IsNullOrWhiteSpace(input.Captcha) && !string.IsNullOrWhiteSpace(input.CaptchaKey))
        {
            if (!captcha.Validate(input.CaptchaKey, input.Captcha))
            {
                throw new UserFriendlyException("验证码错误");
            }
        }
        else
        {
            throw new UserFriendlyException("验证码不能为空");
        }

        var user = await userRepository.GetAsync(input.UserName);

        if (user == null)
        {
            throw new UserFriendlyException("用户不存在");
        }

        if (!user.CheckCipher(input.Password))
        {
            throw new UserFriendlyException("密码错误");
        }

        if (user.IsDisable)
        {
            throw new UserFriendlyException("用户已被禁用");
        }

        var roles = await roleRepository.GetRolesAsync(user.Id);

        var dist = new Dictionary<string, string>
        {
            { ClaimTypes.Name, user.Name },
            { ClaimTypes.Role, string.Join(',', roles.Select(x => x.Code)) },
            { ClaimTypes.NameIdentifier, user.Id },
            { ClaimTypes.Email, user.Email },
            { ClaimTypes.MobilePhone, user.Phone },
            { ClaimTypes.GivenName, user.Name },
            { ClaimTypes.Surname, user.Name }
        };

        var token = jwtService.GenerateToken(dist, DateTime.Now.AddDays(7));

        return token;
    }
}