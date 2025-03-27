namespace Koala.Application.Contract.Application.Dto;

public class AgentConfigDto
{
    public long Id { get; set; }
    
    public long AgentId { get; set; }

    /// <summary>
    /// 智能体模型
    /// </summary>
    public string Model { get; private set; } = null!;

    /// <summary>
    /// 温度
    /// </summary>
    public double Temperature { get; private set; }

    /// <summary>
    /// 生成随机性
    /// </summary>
    public double TopP { get; private set; }

    /// <summary>
    /// 最大回复长度
    /// </summary>
    public int MaxResponseToken { get; private set; }

    /// <summary>
    /// 输出格式
    /// </summary>
    public string OutputFormat { get; private set; } = null!;

    /// <summary>
    /// 携带上文数量
    /// </summary>
    public int ContextSize { get; private set; }

    /// <summary>
    /// 开场白
    /// </summary>
    public string? Opening { get; private set; }

    /// <summary>
    /// 用户问题建议
    /// 在用户问题后面追加建议问题
    /// </summary>
    public bool SuggestUserQuestion { get; private set; }

    /// <summary>
    /// 提示词
    /// 当前智能体的提示词
    /// </summary>
    public string? Prompt { get; private set; }
}