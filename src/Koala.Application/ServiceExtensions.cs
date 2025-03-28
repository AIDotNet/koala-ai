using Koala.Application.WorkFlows;
using Mapster;
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

        services.AddKoalaWorkflow();
        
        return services;
    }
}