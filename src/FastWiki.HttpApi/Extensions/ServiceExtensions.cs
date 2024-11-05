using FastWiki.Application.Contract.Authorization;
using FastWiki.Application.Contract.Authorization.Input;
using FastWiki.Application.Contract.Notification;
using FastWiki.Application.Contract.Powers;
using FastWiki.Application.Contract.Powers.Input;
using FastWiki.Application.Contract.Users;
using FastWiki.Application.Contract.Users.Input;
using FastWiki.Application.Contract.WorkSpaces;
using FastWiki.Application.Contract.WorkSpaces.Input;
using FastWiki.Core;
using FastWiki.HttpApi.Filter;
using FastWiki.HttpApi.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace FastWiki.HttpApi.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddHttpApi(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddSingleton<IUserContext, UserContext>();


        return services;
    }

    public static IApplicationBuilder UseHttpApi(this IApplicationBuilder builder)
    {
        builder.UseMiddleware<HandlingExceptionMiddleware>();


        return builder;
    }

    public static IEndpointRouteBuilder MapApis(this IEndpointRouteBuilder endpoint)
    {
        var user = endpoint.MapGroup("/api/v1/users")
            .AddEndpointFilter<ResultFilter>()
            .RequireAuthorization();

        user.MapPost(string.Empty,
                async (IUserService service, CreateUserInput input) => await service.CreateAsync(input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "创建用户";
                operation.Description = "创建用户";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "用户"
                    }
                };
                return operation;
            }));

        user.MapPut("{id}",
                async (IUserService service, string id, UpdateUserInput input) => await service.UpdateAsync(id, input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "更新用户";
                operation.Description = "更新用户";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "用户"
                    }
                };
                return operation;
            }));

        user.MapDelete("{id}",
                async (IUserService service, string id) => await service.DeleteAsync(id))
            .WithOpenApi((operation =>
            {
                operation.Summary = "删除用户";
                operation.Description = "删除用户";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "用户"
                    }
                };
                return operation;
            }));

        user.MapGet(string.Empty,
                async (IUserService service, string? keyword, int page, int pageSize) =>
                    await service.GetListAsync(keyword, page, pageSize))
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取用户列表";
                operation.Description = "获取用户列表";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "用户"
                    }
                };
                return operation;
            }));

        user.MapGet("current",
                async (IUserService service) => await service.GetCurrentAsync())
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取当前用户";
                operation.Description = "获取当前用户";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "用户"
                    }
                };
                return operation;
            }));

        var authorization = endpoint.MapGroup("/api/v1/authorization")
            .AddEndpointFilter<ResultFilter>();

        authorization.MapPost("token",
                async (IAuthorizationService service, TokenInput input) => await service.TokenAsync(input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取Token";
                operation.Description = "获取Token";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "授权"
                    }
                };
                return operation;
            }));

        var notification = endpoint.MapGroup("/api/v1/notifications")
            .AddEndpointFilter<ResultFilter>();

        notification.MapPost("login",
                async (INotificationService service) => await service.GetLoginVerificationCodeAsync())
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取验证码";
                operation.Description = "获取验证码";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "通知"
                    }
                };
                return operation;
            }));

        notification.MapPost("register",
                async (INotificationService service, string account) =>
                    await service.GetRegisterVerificationCodeAsync(account))
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取验证码";
                operation.Description = "获取验证码";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "通知"
                    }
                };
                return operation;
            }));

        var workSpaces = endpoint.MapGroup("/api/v1/workspaces")
            .AddEndpointFilter<ResultFilter>()
            .RequireAuthorization();

        workSpaces.MapPost(string.Empty,
                async (IWorkSpacesService service, WorkSpacesInput input) => await service.CreateAsync(input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "创建工作空间";
                operation.Description = "创建工作空间";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "工作空间"
                    }
                };
                return operation;
            }));

        workSpaces.MapPut("{id}",
                async (IWorkSpacesService service, long id, WorkSpacesInput input) =>
                    await service.UpdateAsync(id, input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "更新工作空间";
                operation.Description = "更新工作空间";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "工作空间"
                    }
                };
                return operation;
            }));

        workSpaces.MapDelete("{id}",
                async (IWorkSpacesService service, long id) => await service.DeleteAsync(id))
            .WithOpenApi((operation =>
            {
                operation.Summary = "删除工作空间";
                operation.Description = "删除工作空间";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "工作空间"
                    }
                };
                return operation;
            }));

        workSpaces.MapGet(string.Empty,
                async (IWorkSpacesService service) => await service.GetAsync())
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取工作空间";
                operation.Description = "获取工作空间";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "工作空间"
                    }
                };
                return operation;
            }));

        var powers = endpoint.MapGroup("/api/v1/powers")
            .AddEndpointFilter<ResultFilter>()
            .RequireAuthorization();

        powers.MapPost("role",
                async (IPowersService service, RoleInput input) => await service.CreateRoleAsync(input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "创建角色";
                operation.Description = "创建角色";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "权限"
                    }
                };
                return operation;
            }));

        powers.MapPut("role/{id}",
                async (IPowersService service, string id, RoleInput input) => await service.UpdateRoleAsync(id, input))
            .WithOpenApi((operation =>
            {
                operation.Summary = "更新角色";
                operation.Description = "更新角色";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "权限"
                    }
                };
                return operation;
            }));

        powers.MapDelete("role/{id}",
                async (IPowersService service, string id) => await service.DeleteRoleAsync(id))
            .WithOpenApi((operation =>
            {
                operation.Summary = "删除角色";
                operation.Description = "删除角色";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "权限"
                    }
                };
                return operation;
            }));

        powers.MapGet("role",
                async (IPowersService service) => await service.GetRolesAsync())
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取角色列表";
                operation.Description = "获取角色列表";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "权限"
                    }
                };
                return operation;
            }));

        powers.MapPost("role/bind/{userId}",
                async (IPowersService service, string userId, [FromBody] List<string> roleIds) =>
                await service.BindUserRoleAsync(userId, roleIds))
            .WithOpenApi((operation =>
            {
                operation.Summary = "绑定用户角色";
                operation.Description = "绑定用户角色";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "权限"
                    }
                };
                return operation;
            }));

        powers.MapGet("role/{userId}",
                async (IPowersService service, string userId) => await service.GetUserRolesAsync(userId))
            .WithOpenApi((operation =>
            {
                operation.Summary = "获取用户角色";
                operation.Description = "获取用户角色";
                operation.Tags = new List<OpenApiTag>()
                {
                    new OpenApiTag()
                    {
                        Name = "权限"
                    }
                };
                return operation;
            }));


        return endpoint;
    }
}