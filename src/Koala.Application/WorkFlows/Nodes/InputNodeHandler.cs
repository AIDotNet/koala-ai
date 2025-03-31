using Koala.Application.WorkFlows;

namespace Koala.Application.WorkFlows.Nodes;

/// <summary>
/// 输入节点处理器
/// </summary>
public class InputNodeHandler : INodeHandler
{
    /// <summary>
    /// 获取支持的节点类型
    /// </summary>
    public string NodeType => "input";
    
    /// <summary>
    /// 处理节点
    /// </summary>
    /// <param name="node">节点</param>
    /// <param name="workflowData">工作流数据</param>
    public void HandleNode(FlowNode node, WorkflowData workflowData)
    {
        // 输入节点，输入数据已经在workflowData中
        // 不需要特别处理，直接传递给下一个节点
    }
} 