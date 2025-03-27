using Koala.Application.Contract.Authorization;
using Koala.Application.Contract.Authorization.Input;
using Koala.HttpApi.Filter;

namespace Koala.HttpApi.Extensions;

// AuthorizationEndpoints.cs
public static class AuthorizationEndpoints
{
    public static IEndpointRouteBuilder MapAuthorizationEndpoints(this IEndpointRouteBuilder endpoint)
    {
        var authorization = endpoint.MapGroup("/api/v1/authorization")
            .WithTags("授权管理")
            .AddEndpointFilter<ResultFilter>();

        authorization.MapPost("token",
                [EndpointSummary("获取Token"), EndpointDescription("获取Token")]
                async (IAuthorizationService service, TokenInput input) => await service.TokenAsync(input));

        return endpoint;
    }
}