using FastWiki.Application.Contract.Application.Dto;
using FastWiki.Core;
using FastWiki.Domain.Agents.Aggregates;
using FastWiki.Domain.Agents.Repositories;
using MapsterMapper;

namespace FastWiki.Application.Contract.Application;

public class AgentService(
    IAgentRepository agentRepository,
    IUserContext userContext,
    IMapper mapper
) : IAgentService, IScopeDependency
{
    public async Task<PagedResultDto<AgentDto>> GetListAsync(long workspaceId, int page, int pageSize, string? keyword)
    {
        var query = await agentRepository.GetListAsync(workspaceId, page, pageSize, keyword);

        var count = await agentRepository.GetCountAsync(workspaceId, keyword);

        var result = mapper.Map<List<AgentDto>>(query);

        return new PagedResultDto<AgentDto>(count, result);
    }

    public async Task CreateAsync(AgentInput input)
    {
        if (await agentRepository.AnyAsync(a => a.Name == input.Name && a.WorkSpaceId == input.WorkSpaceId))
        {
            throw new BusinessException("已经存在相同名称的智能体");
        }

        var agent = new Agent(input.Name, input.Introduction, input.Avatar, input.WorkSpaceId);

        await agentRepository.AddAsync(agent);
    }

    public async Task DeleteAsync(long id)
    {
        await agentRepository.DeleteAsync(x => x.Id == id && x.Creator == userContext.UserId);
    }

    public async Task UpdateAsync(long id, AgentInput input)
    {
        var agent = await agentRepository.FirstAsync(x => x.Id == id && x.Creator == userContext.UserId);

        if (agent != null)
        {
            agent.SetName(input.Name);
            agent.SetIntroduction(input.Introduction);
            agent.SetAvatar(input.Avatar);
            await agentRepository.UpdateAsync(agent);
        }
    }
}