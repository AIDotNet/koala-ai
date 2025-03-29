using Koala.Domain.WorkFlows.Definitions;
using WorkflowCore.Interface;
using WorkflowCore.Models;

namespace Koala.Application.WorkFlows.Definitions;

/// <summary>
/// 图像处理步骤体
/// </summary>
public class ImageProcessingStepBody : WorkflowCore.Interface.IStepBody
{
    public ImageProcessingStepBody()
    {
        
    }
    
    /// <summary>
    /// 图像URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// 处理类型
    /// </summary>
    public string ProcessingType { get; set; } = "analyze";

    /// <summary>
    /// 处理结果
    /// </summary>
    public string Result { get; set; } = string.Empty;

    /// <summary>
    /// 变量字典
    /// </summary>
    public Dictionary<string, object>? Variables { get; set; }

    /// <summary>
    /// 结果存储键
    /// </summary>
    public string? OutputKey { get; set; }

    /// <summary>
    /// 执行步骤
    /// </summary>
    /// <param name="context">执行上下文</param>
    /// <returns>执行结果</returns>
    public async Task<ExecutionResult> RunAsync(IStepExecutionContext context)
    {
        try
        {
            // 这里是图像处理逻辑，实际项目中需要替换为真实的API调用
            Result = await SimulateImageProcessingAsync(ImageUrl, ProcessingType);

            // 如果有指定输出键，将结果存储到数据上下文中
            if (!string.IsNullOrEmpty(OutputKey) && context.PersistenceData is WorkflowData data)
            {
                data.SetProperty(OutputKey, Result);
            }

            return ExecutionResult.Next();
        }
        catch (Exception ex)
        {
            return ExecutionResult.Sleep(TimeSpan.FromSeconds(10), ex.Message);
        }
    }

    /// <summary>
    /// 模拟图像处理（实际项目中应替换为真实API调用）
    /// </summary>
    /// <param name="imageUrl">图像URL</param>
    /// <param name="processingType">处理类型</param>
    /// <returns>处理结果</returns>
    private async Task<string> SimulateImageProcessingAsync(string imageUrl, string processingType)
    {
        // 模拟API调用延迟
        await Task.Delay(1000);

        // 根据处理类型返回不同的模拟结果
        switch (processingType.ToLower())
        {
            case "analyze":
                return $"图像分析结果：图像中包含1人、2棵树、1栋建筑物。主色调为蓝色和绿色。";
            case "caption":
                return $"一个人站在树下的建筑物前，阳光明媚的日子。";
            case "ocr":
                return $"图像中检测到的文本：\"WELCOME TO KOALA AI\"";
            default:
                return $"未知的处理类型: {processingType}";
        }
    }
}