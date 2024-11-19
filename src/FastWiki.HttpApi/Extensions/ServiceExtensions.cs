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
        endpoint.MapUserEndpoints();
        endpoint.MapAuthorizationEndpoints();
        endpoint.MapNotificationEndpoints();
        endpoint.MapWorkSpacesEndpoints();
        endpoint.MapPowersEndpoints();

        return endpoint;
    }
}