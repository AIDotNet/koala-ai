using FastWiki.Application.Contract.Application;
using FastWiki.Application.Contract.Application.Dto;
using FastWiki.HttpApi.Filter;

namespace FastWiki.HttpApi.Extensions;

public static class AgentEndpoints
{
    public static IEndpointRouteBuilder MapAgentEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var agent = endpoint.MapGroup("/api/v1/agent")
            .WithTags("智能体管理")
            .AddEndpointFilter<ResultFilter>();

        agent.MapGet("",
            [EndpointSummary("应用列表"), EndpointDescription("应用列表")]
            async (IAgentService service, long workspaceId, int page, int pageSize, string? keyword) =>
                await service.GetListAsync(workspaceId, page, pageSize, keyword));

        agent.MapPost("",
            [EndpointSummary("创建应用"), EndpointDescription("创建应用")]
            async (IAgentService service, AgentInput input) => await service.CreateAsync(input));
        
        agent.MapPut("{id}",
            [EndpointSummary("更新应用"), EndpointDescription("更新应用")]
            async (IAgentService service, long id, AgentInput input) => await service.UpdateAsync(id, input));
        
        agent.MapDelete("{id}",
            [EndpointSummary("删除应用"), EndpointDescription("删除应用")]
            async (IAgentService service, long id) => await service.DeleteAsync(id));
        
        agent.MapGet("{id}",
            [EndpointSummary("获取应用详情"), EndpointDescription("获取应用详情")]
            async (IAgentService service, long id) => await service.GetAsync(id));
        
        return endpoint;
    }
}