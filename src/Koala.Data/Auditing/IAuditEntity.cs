using Koala.Data.Aggregates;

namespace Koala.Data.Auditing;

public interface IAuditEntity<out TKey> : IEntity<TKey>,ICreator,IModifier
{
}