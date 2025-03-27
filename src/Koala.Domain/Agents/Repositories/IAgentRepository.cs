using Koala.Data.Repositories;
using Koala.Domain.Agents.Aggregates;

namespace Koala.Domain.Agents.Repositories;

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
    
    /// <summary>
    /// 获取Agent 配置
    /// </summary>
    /// <param name="agentId"></param>
    /// <returns></returns>
    Task<AgentConfig> GetAgentConfigAsync(long agentId);
    
    /// <summary>
    /// 添加Agent 配置
    /// </summary>
    /// <param name="agentConfig"></param>
    /// <returns></returns>
    Task AddAgentConfigAsync(AgentConfig agentConfig);
}