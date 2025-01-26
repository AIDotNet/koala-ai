using FastWiki.Application.Contract.knowledge;
using FastWiki.Application.Contract.knowledge.Dto;
using FastWiki.HttpApi.Filter;

namespace FastWiki.HttpApi.Extensions;

public static class KnowledgeEndpoints
{
    public static IEndpointRouteBuilder MapKnowledgeEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var knowledge = endpoint.MapGroup("/api/v1/knowledge")
            .WithTags("知识管理")
            .AddEndpointFilter<ResultFilter>();

        knowledge.MapGet("list",
                [EndpointSummary("获取知识列表"), EndpointDescription("获取知识列表")]
        async (IKnowledgeService service, long workspaceId, int page, int pageSize, string? keyword) => await service.GetListAsync(workspaceId, page, pageSize, keyword));

        knowledge.MapGet("{id}",
                [EndpointSummary("获取知识详情"), EndpointDescription("获取知识详情")]
        async (IKnowledgeService service, string id) => await service.GetAsync(id));

        knowledge.MapDelete("id",
                [EndpointSummary("删除知识"), EndpointDescription("删除知识")]
        async (IKnowledgeService service, string id) => await service.DeleteAsync(id));

        knowledge.MapPost("create",
                [EndpointSummary("创建知识"), EndpointDescription("创建知识")]
        async (IKnowledgeService service, CreateKnowledge input) => await service.CreateAsync(input));

        return endpoint;
    }
}
