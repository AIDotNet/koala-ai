using System.Linq.Expressions;
using FastWiki.Data.Repositories;

namespace FastWiki.Domain.WorkSpace.Repositories;

public interface IWorkSpaceRepository : IRepository<WorkSpaces.Aggregates.WorkSpace>
{
    /// <summary>
    /// 创建工作空间
    /// </summary>
    /// <param name="workSpace"></param>
    /// <returns></returns>
    Task CreateAsync(WorkSpaces.Aggregates.WorkSpace workSpace);

    /// <summary>
    /// 删除工作空间
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(long id);

    /// <summary>
    /// 更新工作空间
    /// </summary>
    /// <returns></returns>
    Task UpdateAsync(WorkSpaces.Aggregates.WorkSpace workSpace);

    /// <summary>
    /// 获取用户的工作空间
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<WorkSpaces.Aggregates.WorkSpace>> GetListAsync(string userId);
}