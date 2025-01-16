namespace FastWiki.Application.Contract.Application.Dto;

public class AgentDto
{
    public long Id { get; set; }
    
    /// <summary>
    /// 智能体名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 智能体介绍
    /// </summary>
    /// <returns></returns>
    public string Introduction { get; private set; } = null!;

    /// <summary>
    /// 智能体 Avatar
    /// </summary>
    public string Avatar { get; private set; } = null!;
    
    /// <summary>
    /// 是否收藏
    /// </summary>
    /// <returns></returns>
    public bool IsCollect { get; private set; }
    
    /// <summary>
    /// 是否置顶
    /// </summary>
    /// <returns></returns>
    public bool IsTop { get; private set; }

    /// <summary>
    /// 工作空间Id
    /// 可空
    /// </summary>
    public long? WorkSpaceId { get; set; }
    
    public AgentConfigDto? AgentConfig { get; set; }
}