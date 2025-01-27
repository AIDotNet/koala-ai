using FastWiki.Domain.Knowledge.Aggregates;
using FastWiki.Domain.Knowledge.Repositories;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

public class KnowledgeRepository(IContext context) : Repository<FastWikiKnowledge>(context), IKnowledgeRepository
{
}