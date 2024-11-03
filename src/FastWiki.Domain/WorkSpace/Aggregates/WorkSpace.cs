using FastWiki.Domain.Shared.WorkSpace;

namespace FastWiki.Domain.WorkSpaces.Aggregates;

public class WorkSpace : AuditEntity<long>
{
    /// <summary>
    /// 工作空间名称
    /// </summary>
    /// <returns></returns>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// 工作空间描述
    /// </summary>
    /// <returns></returns>
    public string? Description { get; private set; }

    /// <summary>
    /// 工作空间状态
    /// </summary>
    public WorkSpaceState State { get; private set; }


    public WorkSpace(string name, string? description)
    {
        Name = name;
        Description = description;
        // 默认激活
        SetState(WorkSpaceState.Activate);
    }

    public void SetState(WorkSpaceState state)
    {
        State = state;
    }

    protected WorkSpace()
    {

    }
}