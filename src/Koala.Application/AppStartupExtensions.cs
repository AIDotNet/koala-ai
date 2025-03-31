using Koala.Application.Contract.WorkFlows;
using Koala.Application.WorkFlows;
using Koala.Application.WorkFlows.Nodes;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.Application
{
    public static class AppStartupExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IWorkflowService, WorkflowExecutionService>();
            
            // 注册节点处理器
            services.AddScoped<INodeHandler, InputNodeHandler>();
            services.AddScoped<INodeHandler, OutputNodeHandler>();
            services.AddScoped<INodeHandler, LlmCallNodeHandler>();
            services.AddScoped<NodeHandlerFactory>();
            
            return services;
        }
    }
} 