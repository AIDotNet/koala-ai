namespace FastWiki.Domain.Plugins.Aggregates;

public class PluginItem : AuditEntity<long>
{
    public long PluginId { get; set; }

    /// <summary>
    /// 工具名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 工具描述
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// 插件入参参数
    /// </summary>
    public List<PluginItemParameter> Parameters { get; set; } = new List<PluginItemParameter>();

    /// <summary>
    /// 插件输出参数
    /// </summary>
    public List<PluginItemOutputParameter> OutputParameters { get; set; } = new List<PluginItemOutputParameter>();

    public PluginItem(string name, string description)
    {
        SetName(name);
        SetDescription(description);
    }

    public void SetName(string name)
    {
        // 校验插件名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("工具名称不能为空");
        }
        if (name.Length > 20)
        {
            throw new ArgumentException("工具名称长度不能超过20");
        }
        Name = name;
    }

    public void SetDescription(string description)
    {
        // 校验插件描述
        if (description.IsNullOrEmpty())
        {
            throw new ArgumentException("工具描述不能为空");
        }
        if (description.Length > 200)
        {
            throw new ArgumentException("工具描述长度不能超过200");
        }
        Description = description;
    }

    /// <summary>
    /// 绑定插件
    /// </summary>
    /// <param name="pluginId"></param>
    public void BindingPlugin(long pluginId)
    {
        PluginId = pluginId;
    }
}

public class PluginItemParameter
{
    /// <summary>
    /// 工具名称
    /// </summary>
    public string Name { get; set; } = null!;

    /// <summary>
    /// 工具描述
    /// </summary>
    public string Description { get; set; } = null!;

    /// <summary>
    /// 工具类型
    /// </summary>
    public string Type { get; set; } = null!;

    /// <summary>
    /// 是否必填
    /// </summary>
    public bool Required { get; set; }

    /// <summary>
    /// 插件源码
    /// </summary>
    public string Code { get; set; }


}

/// <summary>
/// 插件输出参数
/// </summary>
public class PluginItemOutputParameter
{
    /// <summary>
    /// 工具名称
    /// </summary>
    public string Name { get; set; } = null!;
    /// <summary>
    /// 工具描述
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// 工具类型
    /// </summary>
    public string Type { get; set; } = null!;

    /// <summary>
    /// 是否必填
    /// </summary>
    public bool Required { get; set; }
}