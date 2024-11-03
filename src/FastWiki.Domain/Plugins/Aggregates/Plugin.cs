using FastWiki.Domain.WorkSpaces.Aggregates;

namespace FastWiki.Domain.Plugins.Aggregates;

public class Plugin : AuditEntity<long>
{
    /// <summary>
    /// 插件名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 插件描述
    /// </summary>
    public string Description { get; private set; } = null!;

    /// <summary>
    /// 插件运行时
    /// Node.js
    /// Python
    /// c#
    /// </summary>
    public string Runtime { get; private set; } = null!;

    /// <summary>
    /// 插件 Avatar
    /// </summary>
    public string Avatar { get; private set; } = null!;

    /// <summary>
    /// 是否启用插件
    /// </summary>
    public bool Enable { get; private set; }

    /// <summary>
    /// 工作空间Id
    /// 可空
    /// </summary>
    public long? WorkSpaceId { get; set; }
    
    public WorkSpace WorkSpace { get; set; }

    public Plugin(string name, string description, string runtime, string avatar)
    {
        SetName(name);
        SetDescription(description);
        SetRuntime(runtime);
        SetAvatar(avatar);
        Enable = true;
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
        // 校验插件名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("插件名称不能为空");
        }
        if (name.Length > 20)
        {
            throw new ArgumentException("插件名称长度不能超过20");
        }
        Name = name;
    }

    public void SetDescription(string description)
    {
        // 校验插件描述
        if (description.IsNullOrEmpty())
        {
            throw new ArgumentException("插件描述不能为空");
        }
        if (description.Length > 200)
        {
            throw new ArgumentException("插件描述长度不能超过200");
        }
        Description = description;
    }

    public void SetRuntime(string runtime)
    {
        // 校验插件运行时
        if (runtime.IsNullOrEmpty())
        {
            throw new ArgumentException("插件运行时不能为空");
        }
        if (runtime.Length > 20)
        {
            throw new ArgumentException("插件运行时长度不能超过20");
        }
        Runtime = runtime;
    }

    public void SetAvatar(string avatar)
    {
        // 校验插件 Avatar
        if (avatar.IsNullOrEmpty())
        {
            throw new ArgumentException("插件 Avatar不能为空");
        }
        Avatar = avatar;
    }


}
