namespace Koala.Core.Model;

public abstract class AuditEntityDto<TKey>
{
    public TKey Id { get; set; }

    public string? Creator { get; set; }

    public DateTimeOffset? CreationTime { get; set; }

    public string? Modifier { get; protected set; }

    public DateTimeOffset? ModificationTime { get; set; }
}