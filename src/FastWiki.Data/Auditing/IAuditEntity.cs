using FastWiki.Data.Aggregates;

namespace FastWiki.Data.Auditing;

public interface IAuditEntity<out TKey> : IEntity<TKey>,ICreator,IModifier
{
}