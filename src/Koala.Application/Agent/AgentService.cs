using Koala.Application.Contract.Application.Dto;
using Koala.Core;
using Koala.Domain.Agents.Aggregates;
using Koala.Domain.Agents.Repositories;
using MapsterMapper;
using Microsoft.Extensions.Configuration;

namespace Koala.Application.Contract.Application;

public class AgentService(
    IAgentRepository agentRepository,
    IUserContext userContext,
    IConfiguration configuration,
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
        if (await agentRepository.AnyAsync(a => a.Name == input.Name && a.WorkspaceId == input.WorkSpaceId))
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

    public async Task<AgentDto> GetAsync(long id)
    {
        var agent = await agentRepository.FirstAsync(x => x.Creator == userContext.UserId && x.Id == id);

        var config = await agentRepository.GetAgentConfigAsync(id);

        if (config == null)
        {
            config = new AgentConfig(id, configuration["Agent:Model"],
                0.5,
                0.5,
                4096,
                "markdown",
                10,
                configuration["Agent:Opening"],
                false,
                string.Empty);

            await agentRepository.AddAgentConfigAsync(config);

            await agentRepository.SaveChangesAsync();
        }

        var dto = mapper.Map<AgentDto>(agent);

        dto.AgentConfig = mapper.Map<AgentConfigDto>(config);
        return dto;
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