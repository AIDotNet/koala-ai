using Koala.Data.Repositories;

namespace Koala.Domain.Powers.Repositories;

public interface IRoleRepository : IRepository<Role>
{
    /// <summary>
    /// 获取指定用户的角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<Role>> GetRolesAsync(string userId);
    
    /// <summary>
    /// 创建角色
    /// </summary>
    /// <param name="role"></param>
    /// <returns></returns>
    Task<Role> CreateAsync(Role role);
    
    /// <summary>
    /// 更新角色
    /// </summary>
    /// <param name="role"></param>
    /// <returns></returns>
    Task<Role> UpdateAsync(Role role);
    
    /// <summary>
    /// 删除角色
    /// </summary>
    /// <param name="id">角色id</param>
    /// <returns></returns>
    Task DeleteAsync(string id);
    
    /// <summary>
    /// 获取角色列表
    /// </summary>
    /// <param name="keyword">关键字</param>
    /// <returns></returns>
    Task<List<Role>> GetListAsync(string? keyword);
    
    /// <summary>
    /// 删除用户绑定的角色
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task DeleteUserRolesAsync(string userId);

    /// <summary>
    /// 绑定用户角色
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="roleIds"></param>
    /// <returns></returns>
    Task BindUserRoleAsync(string userId, List<string> roleIds);
}