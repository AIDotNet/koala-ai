using FastWiki.Data.Repositories;
using FastWiki.Domain.Knowledge.Aggregates;

namespace FastWiki.Domain.Knowledge.Repositories;

public interface IKnowledgeRepository : IRepository<FastWikiKnowledge>
{
    
}