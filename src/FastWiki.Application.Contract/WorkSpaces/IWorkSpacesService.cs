using FastWiki.Application.Contract.WorkSpaces.Dto;
using FastWiki.Application.Contract.WorkSpaces.Input;

namespace FastWiki.Application.Contract.WorkSpaces;

public interface IWorkSpacesService
{
    /// <summary>
    /// 创建新的工作空间
    /// </summary>
    /// <param name="workSpacesDto"></param>
    /// <returns></returns>
    Task CreateAsync(WorkSpacesInput workSpacesDto);

    /// <summary>
    /// 更新工作空间
    /// </summary>
    /// <param name="id"></param>
    /// <param name="workSpacesDto"></param>
    /// <returns></returns>
    Task UpdateAsync(long id, WorkSpacesInput workSpacesDto);

    /// <summary>
    /// 删除工作空间
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(long id);
    
    /// <summary>
    /// 获取工作空间
    /// </summary>
    /// <returns></returns>
    Task<List<WorkSpaceDto>> GetAsync();
}