namespace FastWiki.Domain.Chat.Aggregates;

public class ChatHistory : AuditEntity<long>
{
    /// <summary>
    /// 会话Id
    /// </summary>
    public string SessionId { get; set; }

    /// <summary>
    /// 历史内容
    /// </summary>
    public string Content { get;private set; }

    /// <summary>
    /// 发送人
    /// </summary>
    public string UserId { get; private set; }

    /// <summary>
    /// 记录Ip
    /// </summary>
    public string IP { get; private set; }

    /// <summary>
    /// 智能体
    /// </summary>
    public string AgentId { get; private set; }

    /// <summary>
    /// 是否发送消息
    /// </summary>
    public bool SendMessage { get; set; }


    public ChatHistory(string content, string userId, string ip, string agentId)
    {
        Content = content;
        UserId = userId;
        IP = ip;
        AgentId = agentId;
    }

    protected ChatHistory()
    {
    }

}
