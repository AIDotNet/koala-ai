using Koala.Domain.Knowledge.Aggregates;
using Koala.Domain.Knowledge.Repositories;
using Koala.EntityFrameworkCore.EntityFrameworkCore;

namespace Koala.EntityFrameworkCore.Repositories;

public class KnowledgeRepository(IContext context) : Repository<KoalaKnowledge>(context), IKnowledgeRepository
{
}