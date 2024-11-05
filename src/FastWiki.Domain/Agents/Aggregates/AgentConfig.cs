namespace FastWiki.Domain.Agents.Aggregates;

public class AgentConfig : AuditEntity<long>
{
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
    
    public Agent Agent { get; set; } = null!;

    public AgentConfig(long agentId, string model, double temperature, double topP, int maxResponseToken, string outputFormat, int contextSize, string? opening, bool suggestUserQuestion, string? prompt)
    {
        AgentId = agentId;
        SetModel(model);
        SetTemperature(temperature);
        SetTopP(topP);
        SetMaxResponseToken(maxResponseToken);
        SetOutputFormat(outputFormat);
        SetContextSize(contextSize);
        SetOpening(opening);
        SetSuggestUserQuestion(suggestUserQuestion);
        SetPrompt(prompt);
    }

    public void SetModel(string model)
    {
        // 校验模型
        if (model.IsNullOrEmpty())
        {
            throw new ArgumentException("模型不能为空");
        }
        Model = model;
    }

    public void SetTemperature(double temperature)
    {
        // 校验温度
        if (temperature is < 0 or > 1)
        {
            throw new ArgumentException("温度范围为0-1");
        }
        Temperature = temperature;
    }

    public void SetTopP(double topP)
    {
        // 校验生成随机性
        if (topP is < 0 or > 1)
        {
            throw new ArgumentException("生成随机性范围为0-1");
        }
        TopP = topP;
    }

    public void SetMaxResponseToken(int maxResponseToken)
    {
        // 校验最大回复长度
        if (maxResponseToken < 500)
        {
            maxResponseToken = 500;
        }
        MaxResponseToken = maxResponseToken;
    }

    public void SetOutputFormat(string outputFormat)
    {
        // 校验输出格式
        if (outputFormat.IsNullOrEmpty())
        {
            outputFormat = "markdown";
        }
        OutputFormat = outputFormat;
    }

    public void SetContextSize(int contextSize)
    {
        ContextSize = contextSize;
    }

    public void SetOpening(string? opening)
    {
        // 校验开场白
        if (opening != null && opening.Length > 1000)
        {
            throw new ArgumentException("开场白长度不能超过1000");
        }
        Opening = opening;
    }

    public void SetSuggestUserQuestion(bool suggestUserQuestion)
    {
        SuggestUserQuestion = suggestUserQuestion;
    }

    public void SetPrompt(string? prompt)
    {
        Prompt = prompt;
    }

    protected AgentConfig()
    {

    }

}