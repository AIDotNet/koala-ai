using Koala.Core.Model;
using Koala.Application.Contract.Application.Dto;

namespace Koala.Application.Contract.Application;

public interface IAgentService
{
    /// <summary>
    /// 获取智能体列表
    /// </summary>
    /// <param name="workspaceId"></param>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    Task<PagedResultDto<AgentDto>> GetListAsync(long workspaceId, int page, int pageSize, string? keyword);

    /// <summary>
    /// 创建智能体
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    Task CreateAsync(AgentInput input);

    Task<AgentDto> GetAsync(long id);

    /// <summary>
    /// 删除智能体
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task DeleteAsync(long id);

    /// <summary>
    /// 更新智能体
    /// </summary>
    /// <param name="id"></param>
    /// <param name="input"></param>
    /// <returns></returns>
    Task UpdateAsync(long id, AgentInput input);
}