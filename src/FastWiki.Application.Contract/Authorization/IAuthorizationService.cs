using FastWiki.Application.Contract.Authorization.Input;

namespace FastWiki.Application.Contract.Authorization;

public interface IAuthorizationService
{
    /// <summary>
    /// 获取Token
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> TokenAsync(TokenInput input);
}