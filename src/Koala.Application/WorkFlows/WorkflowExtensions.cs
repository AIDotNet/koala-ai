using Koala.Application.Contract.WorkFlows;
using Koala.Domain.WorkFlows.Definitions;
using Microsoft.Extensions.DependencyInjection;
using WorkflowCore.Interface;

namespace Koala.Application.WorkFlows;

/// <summary>
/// 工作流扩展方法
/// </summary>
public static class WorkflowExtensions
{
    /// <summary>
    /// 注册工作流服务
    /// </summary>
    /// <param name="services">服务集合</param>
    /// <returns>服务集合</returns>
    public static IServiceCollection AddKoalaWorkflow(this IServiceCollection services)
    {
        // 注册Workflow Core
        services.AddWorkflow();

        // 注册工作流服务
        services.AddScoped<IWorkflowService, WorkflowExecutionService>();

        // 注册示例工作流，实际应用中可以使用反射自动注册所有继承自IWorkflow的类
        services.AddTransient<IWorkflow<SimpleWorkflowData>, SimpleWorkflowExample>();

        return services;
    }

    /// <summary>
    /// 初始化工作流引擎
    /// </summary>
    /// <param name="workflowHost">工作流主机</param>
    /// <param name="serviceProvider">服务提供器</param>
    /// <returns>工作流主机</returns>
    public static IWorkflowHost InitializeKoalaWorkflow(this IWorkflowHost workflowHost, IServiceProvider serviceProvider)
    {
        // 使用泛型方法注册工作流
        // 根据WorkflowCore的文档，正确的RegisterWorkflow方法是以泛型方式调用的
        workflowHost.RegisterWorkflow<SimpleWorkflowExample, SimpleWorkflowData>();

        // 可以添加其他泛型工作流的注册，或使用反射自动注册所有工作流
        // 例如：
        // var allWorkflowTypes = Assembly
        //    .GetExecutingAssembly()
        //    .GetTypes()
        //    .Where(t => !t.IsAbstract && t.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IWorkflow<>)));
        // 
        // foreach (var workflowType in allWorkflowTypes)
        // {
        //    // 使用反射注册工作流
        //    // ...
        // }

        // 启动工作流主机
        workflowHost.Start();

        return workflowHost;
    }
} 