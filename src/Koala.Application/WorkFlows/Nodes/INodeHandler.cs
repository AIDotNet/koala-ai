using Koala.Application.WorkFlows;

namespace Koala.Application.WorkFlows.Nodes;

/// <summary>
/// 节点处理器接口
/// </summary>
public interface INodeHandler
{
    /// <summary>
    /// 获取支持的节点类型
    /// </summary>
    string NodeType { get; }
    
    /// <summary>
    /// 处理节点
    /// </summary>
    /// <param name="node">节点</param>
    /// <param name="workflowData">工作流数据</param>
    void HandleNode(FlowNode node, WorkflowData workflowData);
    
} 