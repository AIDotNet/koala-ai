using FastWiki.Application.Contract.WorkSpaces;
using FastWiki.Application.Contract.WorkSpaces.Input;
using FastWiki.HttpApi.Filter;

namespace FastWiki.HttpApi.Extensions;

public static class WorkSpacesEndpoints
{
    public static IEndpointRouteBuilder MapWorkSpacesEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var workSpaces = endpoint.MapGroup("/api/v1/workspaces")
            .AddEndpointFilter<ResultFilter>()
            .WithTags("工作空间管理")
            .RequireAuthorization();

        workSpaces.MapPost(string.Empty,
            [EndpointSummary("注册账号"), EndpointDescription("注册账号")]
                async (IWorkSpacesService service, WorkSpacesInput input) => await service.CreateAsync(input));

        workSpaces.MapPut("{id}",
            [EndpointSummary("更新工作空间"), EndpointDescription("更新工作空间")]
                async (IWorkSpacesService service, long id, WorkSpacesInput input) =>
                    await service.UpdateAsync(id, input));

        workSpaces.MapDelete("{id}",
                [EndpointSummary("删除工作空间"), EndpointDescription("删除工作空间")]
                async (IWorkSpacesService service, long id) => await service.DeleteAsync(id));

        workSpaces.MapGet(string.Empty,
            [EndpointSummary("获取工作空间"), EndpointDescription("获取工作空间")]
                async (IWorkSpacesService service) => await service.GetAsync());

        return endpoint;
    }
}