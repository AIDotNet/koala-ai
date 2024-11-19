// PowersEndpoints.cs

using FastWiki.Application.Contract.Powers;
using FastWiki.Application.Contract.Powers.Input;
using FastWiki.HttpApi.Filter;
using Microsoft.AspNetCore.Mvc;

namespace FastWiki.HttpApi.Extensions;

public static class PowersEndpoints
{
        public static IEndpointRouteBuilder MapPowersEndpoints(this IEndpointRouteBuilder endpoint)
        {
                var powers = endpoint.MapGroup("/api/v1/powers")
                        .AddEndpointFilter<ResultFilter>()
                        .WithTags("角色管理")
                        .RequireAuthorization();

                powers.MapPost("role",
                        [EndpointSummary("创建角色"), EndpointDescription("创建角色")]
                        async (IPowersService service, RoleInput input) => await service.CreateRoleAsync(input));

                powers.MapPut("role/{id}",
                        [EndpointSummary("更新角色信息"), EndpointDescription("更新角色信息")]
                        async (IPowersService service, string id, RoleInput input) => await service.UpdateRoleAsync(id, input));

                powers.MapDelete("role/{id}",
                        [EndpointSummary("删除角色"), EndpointDescription("删除角色")]
                        async (IPowersService service, string id) => await service.DeleteRoleAsync(id));

                powers.MapGet("role",
                        [EndpointSummary("获取角色列表"), EndpointDescription("获取角色列表")]
                        async (IPowersService service) => await service.GetRolesAsync());

                powers.MapPost("role/bind/{userId}",
                        [EndpointSummary("绑定用户角色"), EndpointDescription("绑定用户角色")]
                        async (IPowersService service, string userId, [FromBody] List<string> roleIds) =>
                        await service.BindUserRoleAsync(userId, roleIds));

                powers.MapGet("role/{userId}",
                        [EndpointSummary("获取用户角色"), EndpointDescription("获取用户角色")]
                        async (IPowersService service, string userId) => await service.GetUserRolesAsync(userId));

                return endpoint;
        }
}