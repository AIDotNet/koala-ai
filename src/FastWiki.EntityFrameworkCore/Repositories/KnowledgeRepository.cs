using FastWiki.Domain.Knowledges.Aggregates;
using FastWiki.Domain.Knowledges.Repositories;
using FastWiki.EntityFrameworkCore.EntityFrameworkCore;

namespace FastWiki.EntityFrameworkCore.Repositories;

public class KnowledgeRepository(IContext context) : Repository<Knowledge>(context), IKnowledgeRepository
{

}