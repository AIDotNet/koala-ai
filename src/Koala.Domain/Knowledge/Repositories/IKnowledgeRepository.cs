using Koala.Data.Repositories;
using Koala.Domain.Knowledge.Aggregates;

namespace Koala.Domain.Knowledge.Repositories;

public interface IKnowledgeRepository : IRepository<KoalaKnowledge>
{
    
}