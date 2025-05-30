﻿using Koala.Application.Contract.knowledge;
using Koala.Application.Contract.knowledge.Dto;
using Koala.HttpApi.Filter;

namespace Koala.HttpApi.Extensions;

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

        knowledge.MapDelete("{id}",
                [EndpointSummary("删除知识"), EndpointDescription("删除知识")]
        async (IKnowledgeService service, string id) => await service.DeleteAsync(id));

        knowledge.MapPost("",
                [EndpointSummary("创建知识"), EndpointDescription("创建知识")]
        async (IKnowledgeService service, CreateKnowledge input) => await service.CreateAsync(input));

        knowledge.MapPut("{id}",
                [EndpointSummary("更新知识"), EndpointDescription("更新知识")]
                async (IKnowledgeService service, string id, CreateKnowledge input) =>
                        await service.UpdateAsync(id, input));

        return endpoint;
    }
}
