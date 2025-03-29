using Koala.Application.Contract.WorkFlows;
using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkFlows.Definitions;
using Koala.Domain.WorkFlows.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using WorkflowCore.Interface;
using System.Text.Json;

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

        // 自动注册所有实现了IWorkflow<>接口的工作流
        RegisterAllWorkflows(services);

        return services;
    }

    /// <summary>
    /// 自动注册所有工作流
    /// </summary>
    /// <param name="services">服务集合</param>
    private static void RegisterAllWorkflows(IServiceCollection services)
    {
        // 获取当前程序集中所有非抽象类，且实现了IWorkflow<>接口的类型
        var workflowTypes = Assembly
            .GetExecutingAssembly()
            .GetTypes()
            .Where(t => !t.IsAbstract && t.GetInterfaces().Any(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(WorkflowCore.Interface.IWorkflow<>)))
            .ToList();

        foreach (var workflowType in workflowTypes)
        {
            // 获取工作流的数据类型
            var workflowInterface = workflowType.GetInterfaces()
                .FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(WorkflowCore.Interface.IWorkflow<>));
            var dataType = workflowInterface?.GetGenericArguments()[0];

            // 使用开放泛型方法创建对应的封闭泛型方法进行注册
            var registerMethod = typeof(ServiceCollectionServiceExtensions)
                .GetMethods()
                .FirstOrDefault(m => m.Name == "AddTransient" && m.GetParameters().Length == 1 && m.IsGenericMethod && m.GetGenericArguments().Length == 2);

            var genericMethod = registerMethod.MakeGenericMethod(workflowInterface, workflowType);
            genericMethod.Invoke(null, new object[] { services });
        }
    }

    /// <summary>
    /// 初始化工作流引擎
    /// </summary>
    /// <param name="workflowHost">工作流主机</param>
    /// <param name="serviceProvider">服务提供器</param>
    /// <returns>工作流主机</returns>
    public static IWorkflowHost InitializeKoalaWorkflow(this IWorkflowHost workflowHost, IServiceProvider serviceProvider, Workflow workflow)
    {
        // 使用反射自动注册所有工作流
        RegisterAllWorkflowsToHost(workflowHost, serviceProvider, workflow);

        // 启动工作流主机
        workflowHost.Start();

        return workflowHost;
    }

    /// <summary>
    /// 使用反射注册所有工作流到工作流主机
    /// </summary>
    /// <param name="workflowHost">工作流主机</param>
    /// <param name="serviceProvider">服务提供器</param>
    private static void RegisterAllWorkflowsToHost(IWorkflowHost workflowHost, IServiceProvider serviceProvider, Workflow workflow)
    {
        // 首先注册传入的特定工作流
        if (workflow != null)
        {
            try
            {
                // 尝试注册特定的工作流定义
                string workflowId = workflow.Id.ToString();
                int version = workflow.Version; // 从workflow对象获取版本号
                
                // 从工作流定义JSON中解析工作流类型名称
                if (!string.IsNullOrEmpty(workflow.Definition))
                {
                    try
                    {
                        // 解析JSON
                        var jsonDoc = JsonDocument.Parse(workflow.Definition);
                        Type workflowType = null;
                        
                        // 尝试从JSON中读取workflowTypeName属性
                        if (jsonDoc.RootElement.TryGetProperty("workflowTypeName", out var typeElement) && 
                            typeElement.ValueKind == JsonValueKind.String)
                        {
                            string typeName = typeElement.GetString();
                            
                            if (!string.IsNullOrEmpty(typeName))
                            {
                                // 获取工作流类型
                                workflowType = Type.GetType(typeName) ?? 
                                    Assembly.GetExecutingAssembly().GetTypes()
                                    .FirstOrDefault(t => t.FullName == typeName || t.Name == typeName);
                            }
                        }
                        
                        // 如果找不到workflowTypeName，尝试分析节点结构，自动确定工作流类型
                        if (workflowType == null && jsonDoc.RootElement.TryGetProperty("nodes", out var nodesElement) && 
                            nodesElement.ValueKind == JsonValueKind.Array)
                        {
                            // 分析节点类型，确定使用哪种工作流实现
                            var nodeTypes = new List<string>();
                            foreach (var node in nodesElement.EnumerateArray())
                            {
                                if (node.TryGetProperty("type", out var nodeTypeElement) && 
                                    nodeTypeElement.ValueKind == JsonValueKind.String)
                                {
                                    nodeTypes.Add(nodeTypeElement.GetString() ?? "");
                                }
                                
                                if (node.TryGetProperty("data", out var dataElement) && 
                                    dataElement.TryGetProperty("nodeType", out var nodeTypeDataElement) && 
                                    nodeTypeDataElement.ValueKind == JsonValueKind.String)
                                {
                                    nodeTypes.Add(nodeTypeDataElement.GetString() ?? "");
                                }
                            }
                            
                            // 根据节点类型确定工作流类型
                            if (nodeTypes.Contains("llm-call"))
                            {
                                // 查找适合的LLM工作流实现
                                workflowType = Assembly.GetExecutingAssembly().GetTypes()
                                    .FirstOrDefault(t => t.Name.Contains("LlmWorkflow") && 
                                        !t.IsAbstract && 
                                        t.GetInterfaces().Any(i => i.IsGenericType && 
                                            i.GetGenericTypeDefinition() == typeof(WorkflowCore.Interface.IWorkflow<>)));
                            }
                            // 可以添加更多的节点类型判断逻辑
                        }
                        
                        // 如果仍然找不到，使用通用的动态工作流类型
                        if (workflowType == null)
                        {
                            // 查找动态工作流实现
                            workflowType = Assembly.GetExecutingAssembly().GetTypes()
                                .FirstOrDefault(t => t.Name.Contains("DynamicWorkflow") && 
                                    !t.IsAbstract && 
                                    t.GetInterfaces().Any(i => i.IsGenericType && 
                                        i.GetGenericTypeDefinition() == typeof(WorkflowCore.Interface.IWorkflow<>)));
                            
                            // 如果找不到动态工作流实现，尝试创建默认工作流实例
                            if (workflowType == null)
                            {
                                // 获取在线设计的工作流定义，构建适配器
                                Console.WriteLine($"无法确定工作流类型，将使用默认的通用工作流适配器 - {workflow.Name}");
                                
                                // 在这里注册通用工作流类型
                                RegisterGenericWorkflow(workflowHost, workflowId, version, workflow.Definition);
                                return;
                            }
                        }
                        
                        if (workflowType != null)
                        {
                            // 获取RegisterWorkflow方法
                            MethodInfo registerMethod = workflowHost.GetType()
                                .GetMethods()
                                .Where(m => m.Name == "RegisterWorkflow" && m.IsGenericMethod)
                                .FirstOrDefault(m => m.GetGenericArguments().Length == 1);
                                
                            if (registerMethod != null)
                            {
                                // 找到泛型参数类型
                                Type dataType = GetWorkflowDataType(workflowType);
                                if (dataType != null)
                                {
                                    var genericMethod = registerMethod.MakeGenericMethod(workflowType);
                                    genericMethod.Invoke(workflowHost, new object[] { workflowId, version });
                                    Console.WriteLine($"已成功注册工作流：{workflow.Name}(ID: {workflowId})");
                                }
                                else
                                {
                                    Console.WriteLine($"无法获取工作流数据类型：{workflow.Name}");
                                }
                            }
                            else
                            {
                                Console.WriteLine($"无法找到适合的RegisterWorkflow方法来注册工作流：{workflow.Name}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"无法确定工作流类型：{workflow.Name}");
                        }
                    }
                    catch (JsonException ex)
                    {
                        Console.WriteLine($"解析工作流定义JSON失败: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"注册特定工作流失败：{ex.Message}");
            }
        }

        // 获取当前程序集中所有非抽象类，且实现了IWorkflow<>接口的类型
        var workflowTypes = Assembly
            .GetExecutingAssembly()
            .GetTypes()
            .Where(t => !t.IsAbstract && t.GetInterfaces().Any(i =>
                i.IsGenericType && i.GetGenericTypeDefinition() == typeof(Koala.Domain.WorkFlows.Interfaces.IWorkflow<>)))
            .ToList();

        foreach (var workflowType in workflowTypes)
        {
            try
            {
                // 获取工作流的数据类型
                var workflowInterface = workflowType.GetInterfaces()
                    .FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(Koala.Domain.WorkFlows.Interfaces.IWorkflow<>));

                if (workflowInterface == null)
                {
                    continue;
                }

                var dataType = workflowInterface.GetGenericArguments()[0];

                // 直接尝试使用泛型类型注册
                try
                {
                    // 定义要调用的RegisterWorkflow<TWorkflow, TData>方法的委托类型
                    // 找到具有一个泛型参数的RegisterWorkflow重载
                    var registerMethod = workflowHost.GetType()
                        .GetMethods()
                        .Where(m => m.Name == "RegisterWorkflow" && m.IsGenericMethod)
                        .FirstOrDefault(m => m.GetGenericArguments().Length == 1);

                    if (registerMethod != null)
                    {
                        // 只使用一个类型参数，这是有一个类型参数的RegisterWorkflow重载
                        // 但是需要确保这个类型实现了WorkflowCore的IWorkflow接口
                        if (typeof(WorkflowCore.Interface.IWorkflow).IsAssignableFrom(workflowType))
                        {
                            var genericMethod = registerMethod.MakeGenericMethod(workflowType);
                            genericMethod.Invoke(workflowHost, Array.Empty<object>());
                            continue;
                        }
                    }

                    // 如果找不到一个参数的重载，尝试找两个参数的重载
                    registerMethod = workflowHost.GetType()
                        .GetMethods()
                        .Where(m => m.Name == "RegisterWorkflow" && m.IsGenericMethod)
                        .FirstOrDefault(m => m.GetGenericArguments().Length == 2);

                    if (registerMethod != null)
                    {
                        // 使用两个类型参数，确保类型实现了正确的接口
                        if (typeof(WorkflowCore.Interface.IWorkflow<>).MakeGenericType(dataType).IsAssignableFrom(workflowType))
                        {
                            var genericMethod = registerMethod.MakeGenericMethod(workflowType, dataType);
                            genericMethod.Invoke(workflowHost, Array.Empty<object>());
                            continue;
                        }
                    }
                }
                catch (AmbiguousMatchException)
                {
                    // 如果出现多个匹配的方法，尝试更具体的查找
                    try
                    {
                        // 尝试查找RegisterWorkflow<TWorkflow>()重载
                        var specificMethod = workflowHost.GetType()
                            .GetMethod("RegisterWorkflow",
                                BindingFlags.Public | BindingFlags.Instance,
                                null,
                                CallingConventions.Any,
                                [],
                                null);

                        if (specificMethod != null && specificMethod.IsGenericMethod && specificMethod.GetGenericArguments().Length == 1)
                        {
                            // 确保类型实现了WorkflowCore的IWorkflow接口
                            if (typeof(WorkflowCore.Interface.IWorkflow).IsAssignableFrom(workflowType))
                            {
                                var genericMethod = specificMethod.MakeGenericMethod(workflowType);
                                genericMethod.Invoke(workflowHost, []);
                                continue;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        // 记录异常，继续尝试其他方法
                        Console.WriteLine($"尝试特定重载失败: {ex.Message}");
                    }
                }

                // 最后尝试从依赖注入容器获取工作流实例并手动注册
                try
                {
                    // 如果上述方法都失败，尝试从服务容器获取工作流实例
                    object workflowInstance = serviceProvider.GetService(workflowType);

                    if (workflowInstance != null)
                    {
                        // 获取Registry属性，它管理工作流注册
                        var registry = workflowHost.GetType().GetProperty("Registry")?.GetValue(workflowHost);
                        if (registry != null)
                        {
                            // 确保我们有正确的IWorkflow实例
                            if (workflowInstance is WorkflowCore.Interface.IWorkflow workflowObj)
                            {
                                var registerMethod = registry.GetType().GetMethod("RegisterWorkflow", new[] { typeof(WorkflowCore.Interface.IWorkflow) });
                                if (registerMethod != null)
                                {
                                    registerMethod.Invoke(registry, new[] { workflowObj });
                                    continue;
                                }
                            }
                            else if (dataType != null)
                            {
                                // 尝试适配为泛型IWorkflow<TData>
                                var genericIWorkflowType = typeof(WorkflowCore.Interface.IWorkflow<>).MakeGenericType(dataType);
                                if (genericIWorkflowType.IsInstanceOfType(workflowInstance))
                                {
                                    var registerMethod = registry.GetType().GetMethod("RegisterWorkflow", new[] { genericIWorkflowType });
                                    if (registerMethod != null)
                                    {
                                        registerMethod.Invoke(registry, new[] { workflowInstance });
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"手动注册工作流失败: {ex.Message}");
                }

                throw new InvalidOperationException($"无法注册工作流 {workflowType.Name}，所有尝试都已失败");
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"注册工作流 {workflowType.Name} 时出错: {ex.Message}", ex);
            }
        }
    }

    /// <summary>
    /// 注册通用工作流
    /// </summary>
    private static void RegisterGenericWorkflow(IWorkflowHost workflowHost, string workflowId, int version, string workflowDefinition)
    {
        try
        {
            // 解析工作流定义以构建相应的步骤
            var jsonDoc = JsonDocument.Parse(workflowDefinition);
            if (jsonDoc.RootElement.TryGetProperty("nodes", out var nodesElement) && 
                nodesElement.ValueKind == JsonValueKind.Array &&
                jsonDoc.RootElement.TryGetProperty("edges", out var edgesElement) && 
                edgesElement.ValueKind == JsonValueKind.Array)
            {
                // 这里我们使用工作流构建器API动态注册工作流
                // 注意：这里需要根据实际的WorkflowCore API调整
                var registry = workflowHost.GetType().GetProperty("Registry")?.GetValue(workflowHost);
                if (registry != null)
                {
                    var builderMethod = registry.GetType().GetMethod("ConfigureWorkflow");
                    if (builderMethod != null)
                    {
                        // 动态创建工作流数据类型 - 使用WorkflowData或其子类
                        var dataType = typeof(WorkflowData);
                        
                        // 使用通用注册方法
                        var genericMethod = builderMethod.MakeGenericMethod(dataType);
                        
                        // 调用动态工作流构建方法
                        genericMethod.Invoke(registry, new object[] 
                        { 
                            workflowId, 
                            version,
                            (Action<IWorkflowBuilder<WorkflowData>>)(builder => 
                            {
                                // 这里需要根据节点和边的定义构建工作流步骤
                                // 以下是一个简化的示例，实际实现可能需要更复杂的逻辑
                                
                                // 分析节点和边，构建工作流
                                BuildWorkflowFromDefinition(builder, jsonDoc);
                            })
                        });
                        
                        Console.WriteLine($"已成功注册动态工作流：{workflowId} (版本: {version})");
                    }
                    else
                    {
                        Console.WriteLine("找不到ConfigureWorkflow方法");
                    }
                }
                else
                {
                    Console.WriteLine("找不到Registry对象");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"注册通用工作流失败：{ex.Message}");
        }
    }
    
    /// <summary>
    /// 根据定义构建工作流
    /// </summary>
    private static void BuildWorkflowFromDefinition<T>(IWorkflowBuilder<T> builder, JsonDocument definition)
        where T : WorkflowData, new()
    {
        // 这里实现将JSON定义转换为工作流步骤的逻辑
        // 因为具体实现依赖于您的业务规则和工作流结构，这里只提供一个框架
        
        try
        {
            // 1. 解析节点和边
            var nodes = definition.RootElement.GetProperty("nodes");
            var edges = definition.RootElement.GetProperty("edges");
            
            var nodeDict = new Dictionary<string, JsonElement>();
            
            // 建立节点字典
            foreach (var node in nodes.EnumerateArray())
            {
                if (node.TryGetProperty("id", out var idElement))
                {
                    string id = idElement.GetString() ?? "";
                    if (!string.IsNullOrEmpty(id))
                    {
                        nodeDict[id] = node;
                    }
                }
            }
            
            // 2. 找到入口节点
            JsonElement? startNode = null;
            foreach (var node in nodes.EnumerateArray())
            {
                if (node.TryGetProperty("type", out var typeElement) && 
                    typeElement.ValueKind == JsonValueKind.String &&
                    typeElement.GetString() == "input")
                {
                    startNode = node;
                    break;
                }
            }
            
            if (startNode == null)
            {
                Console.WriteLine("未找到入口节点");
                return;
            }
            
            // 3. 从入口节点开始构建工作流
            // 这里需要递归遍历节点图并构建工作流步骤
            // 示例：仅支持简单的线性工作流
            
            // 在实际实现中，这里需要根据节点类型添加相应的步骤
            // 例如，如果有LLM调用节点，就添加LlmCallStep等
            
            Console.WriteLine("动态构建工作流步骤 - 此功能需要根据实际业务逻辑完善");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"构建工作流失败：{ex.Message}");
        }
    }

    /// <summary>
    /// 获取工作流的数据类型
    /// </summary>
    /// <param name="workflowType">工作流类型</param>
    /// <returns>数据类型</returns>
    private static Type GetWorkflowDataType(Type workflowType)
    {
        // 查找实现的IWorkflow<>接口
        var workflowInterface = workflowType.GetInterfaces()
            .FirstOrDefault(i => i.IsGenericType && 
                (i.GetGenericTypeDefinition() == typeof(WorkflowCore.Interface.IWorkflow<>) ||
                 i.GetGenericTypeDefinition() == typeof(Koala.Domain.WorkFlows.Interfaces.IWorkflow<>)));

        // 返回泛型参数类型（即TData）
        return workflowInterface?.GetGenericArguments()[0];
    }
}