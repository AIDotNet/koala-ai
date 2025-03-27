using Koala.Application.Contract.Powers.Dto;
using Koala.Application.Contract.Powers.Input;

namespace Koala.Application.Contract.Powers;

public interface IPowersService
{
    /// <summary>
    /// 创建角色
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task CreateRoleAsync(RoleInput input);

    /// <summary>
    /// 更新角色信息
    /// </summary>
    /// <param name="id"></param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task UpdateRoleAsync(string id, RoleInput input);

    /// <summary>
    /// 删除角色
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteRoleAsync(string id);

    /// <summary>
    /// 获取角色列表
    /// </summary>
    /// <returns></returns>
    Task<List<RoleDto>> GetRolesAsync();

    /// <summary>
    /// 绑定用户角色
    /// 先删除用户所有角色，再绑定新角色
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="roleIds"></param>
    /// <returns></returns>
    Task BindUserRoleAsync(string userId, List<string> roleIds);

    /// <summary>
    /// 获取用户绑定角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<RoleDto>> GetUserRolesAsync(string userId);
}