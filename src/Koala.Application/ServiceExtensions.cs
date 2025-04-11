using Koala.Application.Contract.WorkFlows;
using Koala.Application.WorkFlows;
using Koala.Application.WorkFlows.Nodes;
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

        services.AddScoped<IWorkflowService, WorkflowExecutionService>();
        services.AddScoped<NodeHandlerFactory>();

        services.AddScoped<INodeHandler, LlmCallNodeHandler>();
        services.AddScoped<INodeHandler, InputNodeHandler>();
        services.AddScoped<INodeHandler, OutputNodeHandler>();

        return services;
    }
}