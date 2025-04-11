using Koala.Domain.Agents.Aggregates;
using Koala.Domain.Knowledge.Aggregates;
using Koala.Domain.Powers.Aggregates;
using Koala.Domain.Users.Aggregates;
using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkSpaces.Aggregates;

namespace Koala.EntityFrameworkCore.EntityFrameworkCore;

public interface IContext
{
    DbSet<TEntity> Set<TEntity>() where TEntity : class;

    DbSet<Agent> Agents { get; set; }

    DbSet<AgentConfig> AgentConfigs { get; set; }

    DbSet<WorkSpace> WorkSpaces { get; set; }

    DbSet<WorkSpaceMember> WorkSpaceMembers { get; set; }

    DbSet<Category> Categories { get; set; }

    DbSet<KoalaKnowledge> Knowledge { get; set; }

    DbSet<KnowledgeItem> KnowledgeItems { get; set; }

    DbSet<QuantizedTask> QuantizedTasks { get; set; }

    DbSet<Role> Roles { get; set; }

    DbSet<User> Users { get; set; }

    DbSet<UserAuthExtensions> UserAuthExtensions { get; set; }

    DbSet<UserRole> UserRoles { get; set; }

    public DbSet<Workflow> Workflows { get; set; }

    public DbSet<WorkflowInstance> WorkflowInstances { get; set; }

    public DbSet<WorkflowConnection> WorkflowConnections { get; set; }

    public DbSet<WorkflowNode> WorkflowNodes { get; set; }
    
    public DbSet<UserModelProvider> UserModelProviders { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// 运行迁移
    /// </summary>
    /// <param name="serviceProvider"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    Task RunMigrationsAsync(IServiceProvider serviceProvider, CancellationToken cancellationToken = default);
}