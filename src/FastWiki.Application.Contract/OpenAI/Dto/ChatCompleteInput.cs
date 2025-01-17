namespace FastWiki.Application.Contract.OpenAI.Dto;

public class ChatCompleteInput
{
    public string Message { get; set; }

    /// <summary>
    /// 智能体Id
    /// </summary>
    public long AgentId { get; set; }
}