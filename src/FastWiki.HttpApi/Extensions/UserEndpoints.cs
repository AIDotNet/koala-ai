using FastWiki.Application.Contract.Users;
using FastWiki.Application.Contract.Users.Input;
using FastWiki.HttpApi.Filter;

namespace FastWiki.HttpApi.Extensions;

// UserEndpoints.cs
public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var user = endpoint.MapGroup("/api/v1/users")
            .AddEndpointFilter<ResultFilter>()
            .WithTags("用户管理")
            .RequireAuthorization();

        user.MapPost(string.Empty,
                [EndpointSummary("创建用户"), EndpointDescription("创建用户")]
                async (IUserService service, CreateUserInput input) => await service.CreateAsync(input));

        user.MapPut("{id}",
            [EndpointSummary("编辑用户"), EndpointDescription("编辑用户")]
                async (IUserService service, string id, UpdateUserInput input) => await service.UpdateAsync(id, input));

        user.MapDelete("{id}",
                [EndpointSummary("删除用户"), EndpointDescription("删除用户")]
                async (IUserService service, string id) => await service.DeleteAsync(id));

        user.MapGet(string.Empty,
                [EndpointSummary("获取用户列表"), EndpointDescription("获取用户列表")]
                async (IUserService service, string? keyword, int page, int pageSize) =>
                    await service.GetListAsync(keyword, page, pageSize));

        user.MapGet("current",
                [EndpointSummary("获取当前登录用户信息"), EndpointDescription("获取当前登录用户信息")]
                async (IUserService service) => await service.GetCurrentAsync());

        return endpoint;
    }
}