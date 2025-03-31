using System.Text.Json;
using Koala.Application.WorkFlows.Nodes;
using Microsoft.Extensions.DependencyInjection;
using WorkflowCore.Interface;
using Koala.Domain.WorkFlows.Aggregates;

namespace Koala.Application.WorkFlows;

/// <summary>
/// 工作流执行工具类
/// </summary>
public static class WorkflowExecutor
{
    /// <summary>
    /// 初始化Koala工作流
    /// </summary>
    /// <param name="workflowHost">工作流主机</param>
    /// <param name="serviceProvider">服务提供者</param>
    /// <param name="workflow">工作流定义</param>
    public static void InitializeKoalaWorkflow(this IWorkflowHost workflowHost, IServiceProvider serviceProvider, Workflow workflow)
    {
        // 这个方法现在实际上不需要注册Workflow，因为我们会在ExecuteWorkflowAsync中直接处理流程
        // 这里只是保留方法作为扩展点，未来可能会使用其他工作流引擎
    }

    /// <summary>
    /// 执行工作流
    /// </summary>
    /// <param name="serviceProvider">服务提供者</param>
    /// <param name="workflowDefinition">工作流定义</param>
    /// <param name="inputData">输入数据</param>
    /// <param name="input"></param>
    /// <returns>执行结果</returns>
    public static WorkflowData ProcessFlowDefinition(IServiceProvider serviceProvider, string workflowDefinition,
        string? inputData, Dictionary<string, string> input)
    {
        try
        {
            // 获取节点处理器工厂
            var nodeHandlerFactory = serviceProvider.GetRequiredService<NodeHandlerFactory>();
            
            // 解析前端传递的工作流定义
            var flowDefinition = ParseFlowDefinition(workflowDefinition);
            
            // 创建工作流数据
            var workflowData = new WorkflowData();
            
            // 如果有输入数据，解析并设置到工作流数据中
            if (!string.IsNullOrEmpty(inputData))
            {
                try
                {
                    var inputDict = JsonSerializer.Deserialize<Dictionary<string, object>>(inputData, JsonSerializerOptions.Web);
                    if (inputDict != null)
                    {
                        foreach (var item in inputDict)
                        {
                            workflowData.SetProperty(item.Key, item.Value);
                        }
                    }
                }
                catch (JsonException ex)
                {
                    // 记录输入数据解析错误但继续执行
                    throw new ArgumentException($"输入数据格式错误: {ex.Message}", ex);
                }
            }
            
            // 处理input参数，将其设置到工作流数据中
            if (input != null && input.Count > 0)
            {
                foreach (var item in input)
                {
                    workflowData.SetInput(item.Key, item.Value);
                }
            }

            // 查找输入节点
            var inputNode = flowDefinition.Nodes.FirstOrDefault(n => n.Data.NodeType.ToLower() == "input");
            if (inputNode == null)
            {
                throw new InvalidOperationException("工作流没有输入节点");
            }

            // 查找输出节点
            var outputNode = flowDefinition.Nodes.FirstOrDefault(n => n.Data.NodeType.ToLower() == "output");
            if (outputNode == null)
            {
                throw new InvalidOperationException("工作流没有输出节点");
            }

            // 构建节点映射
            var nodeMap = flowDefinition.Nodes.ToDictionary(n => n.Id, n => n);
            
            // 构建连接映射（源节点ID -> 目标节点ID列表）
            var connectionMap = new Dictionary<string, List<string>>();
            foreach (var edge in flowDefinition.Edges)
            {
                if (!connectionMap.ContainsKey(edge.Source))
                {
                    connectionMap[edge.Source] = new List<string>();
                }
                connectionMap[edge.Source].Add(edge.Target);
            }
            
            // 构建连接信息映射（源节点ID+目标节点ID -> 连接）
            var edgeMap = flowDefinition.Edges.ToDictionary(
                e => $"{e.Source}_{e.Target}", 
                e => e);

            // 从输入节点开始执行
            ExecuteNode(nodeHandlerFactory, inputNode.Id, nodeMap, connectionMap, edgeMap, workflowData);

            return workflowData;
        }
        catch (Exception ex)
        {
            // 处理执行异常
            var errorData = new WorkflowData();
            errorData.SetProperty("error", ex.Message);
            return errorData;
        }
    }

    /// <summary>
    /// 执行工作流节点
    /// </summary>
    private static void ExecuteNode(
        NodeHandlerFactory nodeHandlerFactory,
        string nodeId, 
        Dictionary<string, FlowNode> nodeMap, 
        Dictionary<string, List<string>> connectionMap,
        Dictionary<string, FlowEdge> edgeMap,
        WorkflowData workflowData)
    {
        // 获取当前节点
        var node = nodeMap[nodeId];
        
        // 获取节点处理器
        var handler = nodeHandlerFactory.GetHandler(node.Data.NodeType);
        
        // 执行节点
        handler.HandleNode(node, workflowData);
        
        // 如果是输出节点，则直接返回
        if (node.Data.NodeType.ToLower() == "output")
        {
            return;
        }
        
        // 处理后续节点
        if (connectionMap.TryGetValue(nodeId, out var nextNodeIds))
        {
            foreach (var nextNodeId in nextNodeIds)
            {
                // 获取连接
                var edgeKey = $"{nodeId}_{nextNodeId}";
                if (edgeMap.TryGetValue(edgeKey, out var edge))
                {
                    // 如果有源句柄和目标句柄，则映射数据
                    if (!string.IsNullOrEmpty(edge.SourceHandle) && !string.IsNullOrEmpty(edge.TargetHandle))
                    {
                        // 获取源数据
                        var sourceData = workflowData.GetProperty(edge.SourceHandle);
                        if (sourceData != null)
                        {
                            // 设置目标数据
                            workflowData.SetProperty(edge.TargetHandle, sourceData);
                        }
                    }
                }
                
                // 执行下一个节点
                ExecuteNode(nodeHandlerFactory, nextNodeId, nodeMap, connectionMap, edgeMap, workflowData);
            }
        }
    }

    /// <summary>
    /// 解析前端传递的工作流定义
    /// </summary>
    /// <param name="definition">工作流定义JSON</param>
    /// <returns>解析后的工作流定义</returns>
    private static FlowDefinition ParseFlowDefinition(string definition)
    {
        try
        {
            return JsonSerializer.Deserialize<FlowDefinition>(definition, JsonSerializerOptions.Web) 
                   ?? throw new ArgumentException("无法解析工作流定义");
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"工作流定义格式错误: {ex.Message}", ex);
        }
    }
} 