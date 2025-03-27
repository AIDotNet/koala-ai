using Koala.Jwt;
using Lazy.Captcha.Core.Generator;
using Mapster;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.Application;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddJwt(configuration);
        
        services.AddAutoGnarly();
        
        services.AddMapster();
        
        services.AddCaptcha();
        
        return services;
    }
}