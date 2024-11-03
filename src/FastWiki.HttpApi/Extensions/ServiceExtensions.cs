using FastWiki.HttpApi.Middleware;

namespace FastWiki.HttpApi.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddHttpApi(this IServiceCollection services)
    {
        
    
        return services;
    }
    
    public static IApplicationBuilder UseHttpApi(this IApplicationBuilder builder)
    {
        builder.UseMiddleware<HandlingExceptionMiddleware>();
        
        return builder;
    }
}