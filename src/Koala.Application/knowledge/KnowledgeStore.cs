using Koala.Application.Contract.knowledge;

namespace Koala.Application.knowledge;

public class KnowledgeStore : IKnowledgeStore
{
    public Task Write()
    {
        throw new NotImplementedException();
    }

    public Task<bool> TryRead()
    {
        throw new NotImplementedException();
    }
}