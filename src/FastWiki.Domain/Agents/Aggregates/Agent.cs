using FastWiki.Domain.Plugins.Aggregates;

namespace FastWiki.Domain.Agents.Aggregates;

public class Agent : AuditEntity<long>
{
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

    public WorkSpaces.Aggregates.WorkSpace WorkSpace { get; set; }

    public Agent(string name, string introduction, string avatar)
    {
        SetName(name);
        SetIntroduction(introduction);
        SetAvatar(avatar);
        IsCollect = false;
        IsTop = false;
    }

    /// <summary>
    /// 绑定工作空间
    /// </summary>
    /// <param name="workSpaceId"></param>
    public void BindingWorkSpace(long workSpaceId)
    {
        WorkSpaceId = workSpaceId;
    }

    public void SetName(string name)
    {
        // 校验智能体名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("智能体名称不能为空");
        }
        if (name.Length > 20)
        {
            throw new ArgumentException("智能体名称长度不能超过20");
        }
        Name = name;
    }

    public void SetIntroduction(string introduction)
    {
        // 校验智能体介绍
        if (introduction.IsNullOrEmpty())
        {
            throw new ArgumentException("智能体介绍不能为空");
        }
        if (introduction.Length > 200)
        {
            throw new ArgumentException("智能体介绍长度不能超过200");
        }
        Introduction = introduction;
    }

    public void SetAvatar(string avatar)
    {
        // 校验智能体 Avatar
        if (avatar.IsNullOrEmpty())
        {
            throw new ArgumentException("智能体 Avatar不能为空");
        }
        Avatar = avatar;
    }

    public void Collect()
    {
        IsCollect = true;
    }

    public void CancelCollect()
    {
        IsCollect = false;
    }

    protected Agent()
    {

    }
}