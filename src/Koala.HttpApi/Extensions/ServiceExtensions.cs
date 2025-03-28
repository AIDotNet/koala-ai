using Koala.Application.Contract.Authorization;
using Koala.Application.Contract.Authorization.Input;
using Koala.Application.Contract.Notification;
using Koala.Application.Contract.Powers;
using Koala.Application.Contract.Powers.Input;
using Koala.Application.Contract.Users;
using Koala.Application.Contract.Users.Input;
using Koala.Application.Contract.WorkSpaces;
using Koala.Application.Contract.WorkSpaces.Input;
using Koala.Core;
using Koala.HttpApi.Filter;
using Koala.HttpApi.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace Koala.HttpApi.Extensions;

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
        endpoint.MapAgentEndpoints();
        endpoint.MapKnowledgeEndpoints();
        endpoint.MapStorageEndpoints();
        endpoint.MapWorkflowEndpoints();

        return endpoint;
    }
}