namespace FastWiki.Domain.Storage;

/// <summary>
/// 文件存储
/// </summary>
public class FileStorage : AuditEntity<string>
{
    /// <summary>
    /// 文件名称
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 文件具体地址
    /// </summary>
    public string FullName { get; private set; } = null!;

    /// <summary>
    /// 文件大小
    /// </summary>
    public long Size { get; private set; }

    /// <summary>
    /// 文件类型
    /// </summary>
    public string Type { get; private set; } = null!;

    /// <summary>
    /// 文件地址
    /// </summary>
    public string Url { get; private set; } = null!;

    public Dictionary<string, string> Tags { get; private set; } = new();
    
    public FileStorage(string name, string fullName, long size, string type, string url)
    {
        SetName(name);
        SetFullName(fullName);
        SetSize(size);
        SetType(type);
        SetUrl(url);
    }
    
    public void SetName(string name)
    {
        // 校验文件名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("文件名称不能为空");
        }

        if (name.Length > 20)
        {
            throw new ArgumentException("文件名称长度不能超过20");
        }

        Name = name;
    }
    
    public void SetFullName(string fullName)
    {
        // 校验文件地址
        if (fullName.IsNullOrEmpty())
        {
            throw new ArgumentException("文件地址不能为空");
        }

        if (fullName.Length > 100)
        {
            throw new ArgumentException("文件地址长度不能超过100");
        }

        FullName = fullName;
    }
    
    public void SetSize(long size)
    {
        // 校验文件大小
        if (size <= 0)
        {
            throw new ArgumentException("文件大小不能小于等于0");
        }

        Size = size;
    }
    
    public void SetType(string type)
    {
        // 校验文件类型
        if (type.IsNullOrEmpty())
        {
            throw new ArgumentException("文件类型不能为空");
        }

        if (type.Length > 20)
        {
            throw new ArgumentException("文件类型长度不能超过20");
        }

        Type = type;
    }
    
    public void SetUrl(string url)
    {
        // 校验文件地址
        if (url.IsNullOrEmpty())
        {
            throw new ArgumentException("文件地址不能为空");
        }

        if (url.Length > 100)
        {
            throw new ArgumentException("文件地址长度不能超过100");
        }

        Url = url;
    }
    
    protected FileStorage()
    {
    }
    
    public void Update(string name, string fullName, long size, string type, string url)
    {
        SetName(name);
        SetFullName(fullName);
        SetSize(size);
        SetType(type);
        SetUrl(url);
    }
    
    public void AddTag(string key, string value)
    {
        Tags.Add(key, value);
    }
    
    public void RemoveTag(string key)
    {
        Tags.Remove(key);
    }
    
    public void ClearTags()
    {
        Tags.Clear();
    }
}