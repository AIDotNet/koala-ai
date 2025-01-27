using FastWiki.Domain.Agents.Aggregates;
using FastWiki.Domain.Knowledge.Aggregates;
using FastWiki.Domain.Knowledges.Aggregates;
using FastWiki.Domain.Powers.Aggregates;
using FastWiki.Domain.Users.Aggregates;
using FastWiki.Domain.WorkSpaces.Aggregates;

namespace FastWiki.EntityFrameworkCore.EntityFrameworkCore;

public interface IContext
{
    DbSet<TEntity> Set<TEntity>() where TEntity : class;
    
    DbSet<Agent> Agents { get; set; }

    DbSet<AgentConfig> AgentConfigs { get; set; }

    DbSet<WorkSpace> WorkSpaces { get; set; }

    DbSet<WorkSpaceMember> WorkSpaceMembers { get; set; }

    DbSet<Category> Categories { get; set; }

    DbSet<FastWikiKnowledge> Knowledge { get; set; }

    DbSet<KnowledgeItem> KnowledgeItems { get; set; }

    DbSet<QuantizedTask> QuantizedTasks { get; set; }

    DbSet<Role> Roles { get; set; }

    DbSet<User> Users { get; set; }

    DbSet<UserAuthExtensions> UserAuthExtensions { get; set; }

    DbSet<UserRole> UserRoles { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// 运行迁移
    /// </summary>
    /// <param name="serviceProvider"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RunMigrationsAsync(IServiceProvider serviceProvider,CancellationToken cancellationToken = default);
}