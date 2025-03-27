namespace Koala.Domain.Knowledge.Aggregates;

public  class Category : AuditEntity<string>
{
    public string Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public string? ParentId { get; private set; }

    public long? WorkSpaceId { get; set; }

    public WorkSpaces.Aggregates.WorkSpace WorkSpace { get; set; }

    public Category(string name, string description, string? parentId)
    {
        ParentId = parentId;
        SetName(name);
        SetDescription(description);
    }

    public void SetName(string name)
    {
        // 校验知识库名称
        if (name.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库分类名称不能为空");
        }

        if (name.Length > 20)
        {
            throw new ArgumentException("知识库分类名称长度不能超过20");
        }

        Name = name;
    }

    public void SetDescription(string description)
    {
        // 校验知识库描述
        if (description.IsNullOrEmpty())
        {
            throw new ArgumentException("知识库分类描述不能为空");
        }

        if (description.Length > 100)
        {
            throw new ArgumentException("知识库描分类述长度不能超过100");
        }

        Description = description;
    }

    protected Category()
    {
    }

    public void Update(string name, string description)
    {
        SetName(name);
        SetDescription(description);
    }
}