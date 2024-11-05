using FastWiki.Application.Contract.Authorization;
using FastWiki.Application.Contract.Authorization.Input;
using FastWiki.Application.Contract.Notification;
using FastWiki.Application.Contract.Users;
using FastWiki.Application.Contract.Users.Input;
using FastWiki.Core;
using FastWiki.HttpApi.Filter;
using FastWiki.HttpApi.Middleware;
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

        return endpoint;
    }
}