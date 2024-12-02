using FastWiki.Data.Repositories;
using FastWiki.Domain.Agents.Aggregates;

namespace FastWiki.Domain.Agents.Repositories;

public interface IAgentRepository : IRepository<Agent>
{
    /// <summary>
    /// Get agent list
    /// </summary>
    /// <param name="workspaceId"></param>
    /// <param name="page"></param>
    /// <param name="pageSize"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    Task<List<Agent>> GetListAsync(long workspaceId, int page, int pageSize, string? keyword);

    /// <summary>
    /// Get agent count
    /// </summary>
    /// <param name="workspaceId"></param>
    /// <param name="keyword"></param>
    /// <returns></returns>
    Task<int> GetCountAsync(long workspaceId, string? keyword);
}