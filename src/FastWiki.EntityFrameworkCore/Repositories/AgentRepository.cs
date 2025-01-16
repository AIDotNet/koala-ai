using FastWiki.Domain.Agents.Aggregates;
using FastWiki.Domain.Agents.Repositories;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

public class AgentRepository(IContext context) : Repository<Agent>(context), IAgentRepository
{
    public Task<List<Agent>> GetListAsync(long workspaceId, int page, int pageSize, string? keyword)
    {
        var query = CreateQuery(workspaceId, keyword);
        return query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public Task<int> GetCountAsync(long workspaceId, string? keyword)
    {
        var query = CreateQuery(workspaceId, keyword);
        return query.CountAsync();
    }

    public Task<AgentConfig> GetAgentConfigAsync(long agentId)
    {
        var query = context.AgentConfigs
            .AsNoTracking()
            .AsQueryable();
        
        return query.FirstOrDefaultAsync(a => a.AgentId == agentId);
    }

    public async Task AddAgentConfigAsync(AgentConfig agentConfig)
    {
        await context.AgentConfigs.AddAsync(agentConfig);
    }

    private IQueryable<Agent> CreateQuery(long workspaceId, string? keyword)
    {
        var query = context.Agents.AsQueryable();
        query = query.Where(a => a.WorkSpaceId == workspaceId);
        if (!string.IsNullOrEmpty(keyword))
        {
            query = query.Where(a => a.Name.Contains(keyword));
        }
        return query;
    }
}