using Koala.Application.Contract.Authorization.Input;

namespace Koala.Application.Contract.Authorization;

public interface IAuthorizationService
{
    /// <summary>
    /// 获取Token
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> TokenAsync(TokenInput input);
}