namespace FastWiki.Data.Auditing;

public abstract class AuditEntity<TKey> : IAuditEntity<TKey>
{
    public TKey Id { get; protected set; }

    public string? Creator { get; protected set; } = default!;

    public DateTimeOffset? CreationTime { get; protected set; }

    public string? Modifier { get; protected set; } = default!;

    public DateTimeOffset? ModificationTime { get; set; }

    protected AuditEntity() => Initialize();

    private void Initialize()
    {
        this.CreationTime = this.GetCurrentTime();
        this.ModificationTime = this.GetCurrentTime();
    }

    protected virtual DateTimeOffset GetCurrentTime() => DateTime.UtcNow;
    
    public void SetCreator(string creator)
    {
        this.Creator = creator;
    }
    
    public void SetModifier(string modifier)
    {
        this.Modifier = modifier;
    }
    
}