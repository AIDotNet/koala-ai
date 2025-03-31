using Koala.Application.AI;

namespace Koala.Application.WorkFlows.Nodes;

/// <summary>
/// LLM调用节点处理器
/// </summary>
public class LlmCallNodeHandler : INodeHandler
{
    /// <summary>
    /// 获取支持的节点类型
    /// </summary>
    public string NodeType => "llm-call";
    
    /// <summary>
    /// 处理节点
    /// </summary>
    /// <param name="node">节点</param>
    /// <param name="workflowData">工作流数据</param>
    public void HandleNode(FlowNode node, WorkflowData workflowData)
    {
        // var kernel = KernelFactory.GetKernel(node.)
        
        // 获取模型ID
        string modelId = node.Data.ModelId ?? "gpt-4o";
        
        // 获取输入（prompt）
        string prompt = workflowData.GetProperty("prompt")?.ToString() ?? "";
        
        // 模拟LLM调用
        string response = $"LLM ({modelId}) 响应: {prompt}";
        
        // 设置输出
        workflowData.SetProperty("output", response);
    }
} 