using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.Application.WorkFlows.Nodes;

/// <summary>
/// 节点处理器工厂
/// </summary>
public class NodeHandlerFactory
{
    private readonly IEnumerable<INodeHandler> _nodeHandlers;
    private readonly Dictionary<string, INodeHandler> _handlerMap;

    /// <summary>
    /// 初始化节点处理器工厂
    /// </summary>
    /// <param name="serviceProvider">服务提供者</param>
    public NodeHandlerFactory(IServiceProvider serviceProvider)
    {
        _nodeHandlers = serviceProvider.GetServices<INodeHandler>();
        _handlerMap = _nodeHandlers.ToDictionary(
            handler => handler.NodeType.ToLower(),
            handler => handler);
    }

    /// <summary>
    /// 获取节点处理器
    /// </summary>
    /// <param name="nodeType">节点类型</param>
    /// <returns>节点处理器</returns>
    public INodeHandler GetHandler(string nodeType)
    {
        if (_handlerMap.TryGetValue(nodeType.ToLower(), out var handler))
        {
            return handler;
        }
        
        throw new NotSupportedException($"不支持的节点类型: {nodeType}");
    }
} 