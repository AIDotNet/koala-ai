namespace Koala.Data.Auditing;

public interface ICreator
{
    string? Creator { get; }

    DateTimeOffset? CreationTime { get; }
}