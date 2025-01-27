using FastWiki.Data.Repositories;
using FastWiki.Domain.Knowledges.Aggregates;

namespace FastWiki.Domain.Knowledges.Repositories;

public interface IKnowledgeRepository : IRepository<Knowledge>
{
    
}