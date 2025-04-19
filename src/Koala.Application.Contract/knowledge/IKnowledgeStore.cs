namespace Koala.Application.Contract.knowledge;

public interface IKnowledgeStore
{
    Task Write();

    Task<bool> TryRead();
}