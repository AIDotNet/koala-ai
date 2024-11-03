namespace FastWiki.Data.Aggregates;

public class Entity<TKey> : IEntity<TKey>
{
    public TKey Id { get; protected set; }
}
