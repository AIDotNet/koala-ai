namespace FastWiki.Domain.Knowledges.Aggregates;

public class KnowledgeItem : AuditEntity<long>
{
    public string KnowledgeId { get; set; }

    /// <summary>
    ///名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 数据地址，可以是URL，也可以是文件路径
    /// </summary>
    public string Data { get; private set; } = null!;

    /// <summary>
    /// 数据数量
    /// </summary>
    public int DataCount { get; set; }

    /// <summary>
    /// 扩展数据
    /// </summary>
    public Dictionary<string, string> ExtraData { get; set; } = new Dictionary<string, string>();

    public Knowledge Knowledge { get; set; }

    public KnowledgeItem(string name, string data)
    {
        SetName(name);
        SetData(data);
    }

    public void SetName(string name)
    {
        // 校验名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("名称不能为空");
        }
        if (name.Length > 20)
        {
            throw new ArgumentException("名称长度不能超过20");
        }
        Name = name;
    }

    public void SetData(string data)
    {
        // 校验数据
        if (data.IsNullOrEmpty())
        {
            throw new ArgumentException("数据不能为空");
        }
        Data = data;
    }

    public void SetExtraData(Dictionary<string, string> extraData)
    {
        ExtraData = extraData;
    }

    public void SetDataCount(int dataCount)
    {
        DataCount = dataCount;
    }

    public void AddExtraData(string key, string value)
    {
        ExtraData.Add(key, value);
    }

    public void RemoveExtraData(string key)
    {
        ExtraData.Remove(key);
    }

    public void ClearExtraData()
    {
        ExtraData.Clear();
    }
}
