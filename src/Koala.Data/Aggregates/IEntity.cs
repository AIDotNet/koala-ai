namespace Koala.Data.Aggregates;

public interface IEntity<out TKey>
{
    TKey Id { get; }
}