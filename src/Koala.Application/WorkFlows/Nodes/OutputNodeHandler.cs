using Koala.Application.WorkFlows;

namespace Koala.Application.WorkFlows.Nodes;

/// <summary>
/// 输出节点处理器
/// </summary>
public class OutputNodeHandler : INodeHandler
{
    /// <summary>
    /// 获取支持的节点类型
    /// </summary>
    public string NodeType => "output";

    /// <summary>
    /// 处理节点
    /// </summary>
    /// <param name="node">节点</param>
    /// <param name="workflowData">工作流数据</param>
    public Task HandleNode(FlowNode node, WorkflowData workflowData)
    {
        // 输出节点，将输入存储到result
        var result = workflowData.GetProperty("result");
        if (result != null)
        {
            workflowData.SetProperty("result", result);
        }
        
        
        return Task.CompletedTask;
    }
} 