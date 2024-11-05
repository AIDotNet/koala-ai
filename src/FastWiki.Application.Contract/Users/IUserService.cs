using FastWiki.Application.Contract.Users.Dto;
using FastWiki.Application.Contract.Users.Input;
using FastWiki.Core.Model;

namespace FastWiki.Application.Contract.Users;

public interface IUserService
{
    /// <summary>
    /// 创建用户
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task<string> CreateAsync(CreateUserInput input);

    /// <summary>
    /// 更新用户
    /// </summary>
    /// <param name="id"></param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task UpdateAsync(string id, UpdateUserInput input);
    
    /// <summary>
    /// 删除用户
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(string id);

    /// <summary>
    /// 获取用户列表
    /// </summary>
    /// <param name="keyword"></param>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <returns></returns>
    Task<PagedResultDto<UserDto>> GetListAsync(string? keyword, int page, int pageSize);
    
    /// <summary>
    /// 获取当前账号信息
    /// </summary>
    /// <returns></returns>
    Task<UserDto> GetCurrentAsync();
}