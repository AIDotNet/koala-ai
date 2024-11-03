namespace FastWiki.Data.Auditing;

public interface IModifier
{
    string Modifier { get; }

    DateTimeOffset ModificationTime { get; }
}