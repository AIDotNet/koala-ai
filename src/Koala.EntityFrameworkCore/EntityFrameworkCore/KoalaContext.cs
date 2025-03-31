using Koala.Core;
using Koala.Data.Auditing;
using Koala.Domain.Agents.Aggregates;
using Koala.Domain.Knowledge.Aggregates;
using Koala.Domain.Knowledges.Aggregates;
using Koala.Domain.Powers.Aggregates;
using Koala.Domain.Shared.WorkSpaces;
using Koala.Domain.Users.Aggregates;
using Koala.Domain.WorkFlows.Aggregates;
using Koala.Domain.WorkSpaces.Aggregates;
using Microsoft.Extensions.DependencyInjection;

namespace Koala.EntityFrameworkCore.EntityFrameworkCore;

public class KoalaContext<TContext>(DbContextOptions<TContext> options, IServiceProvider serviceProvider)
    : DbContext(options), IContext
    where TContext : DbContext
{
    protected IUserContext UserContext => serviceProvider.GetRequiredService<IUserContext>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(IContext).Assembly);
    }

    public DbSet<Agent> Agents { get; set; }

    public DbSet<AgentConfig> AgentConfigs { get; set; }

    public DbSet<WorkSpace> WorkSpaces { get; set; }

    public DbSet<WorkSpaceMember> WorkSpaceMembers { get; set; }

    public DbSet<Category> Categories { get; set; }

    public DbSet<KoalaKnowledge> Knowledge { get; set; }

    public DbSet<KnowledgeItem> KnowledgeItems { get; set; }

    public DbSet<QuantizedTask> QuantizedTasks { get; set; }

    public DbSet<Role> Roles { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<UserAuthExtensions> UserAuthExtensions { get; set; }

    public DbSet<UserRole> UserRoles { get; set; }

    public DbSet<Workflow> Workflows { get; set; }

    public DbSet<WorkflowInstance> WorkflowInstances { get; set; }

    public DbSet<WorkflowConnection> WorkflowConnections { get; set; }

    public DbSet<WorkflowNode> WorkflowNodes { get; set; }

    public DbSet<UserModelProvider> UserModelProviders { get; set; }

    public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = new CancellationToken())
    {
        BeforeSaveChanges();
        return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        BeforeSaveChanges();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    protected void BeforeSaveChanges()
    {
        var entries = ChangeTracker.Entries()
            .Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                var creationTimeProperty = entry.Entity.GetType().GetProperty(nameof(ICreator.CreationTime));
                if (creationTimeProperty != null && creationTimeProperty.PropertyType == typeof(DateTimeOffset?))
                {
                    creationTimeProperty.SetValue(entry.Entity, DateTimeOffset.Now);
                }

                var creatorProperty = entry.Entity.GetType().GetProperty(nameof(ICreator.Creator));
                if (creatorProperty != null && !string.IsNullOrWhiteSpace(UserContext.UserId))
                {
                    creatorProperty.SetValue(entry.Entity, UserContext.UserId);
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                var lastModificationTimeProperty =
                    entry.Entity.GetType().GetProperty(nameof(IModifier.ModificationTime));
                if (lastModificationTimeProperty != null &&
                    lastModificationTimeProperty.PropertyType == typeof(DateTimeOffset?))
                {
                    lastModificationTimeProperty.SetValue(entry.Entity, DateTimeOffset.Now);
                }

                var modifierProperty = entry.Entity.GetType().GetProperty(nameof(IModifier.Modifier));
                if (modifierProperty != null)
                {
                    modifierProperty.SetValue(entry.Entity, UserContext.UserId);
                }
            }
        }
    }

    public async Task RunMigrationsAsync(IServiceProvider serviceProvider,
        CancellationToken cancellationToken = new CancellationToken())
    {
        await Database.MigrateAsync(cancellationToken);

        // 初始化数据
        await using var scope = serviceProvider.CreateAsyncScope();

        var dataInitializer = scope.ServiceProvider.GetRequiredService<IContext>();

        if (dataInitializer is KoalaContext<TContext> context)
        {
            // 判断是否存在初始化数据
            if (await context.Users.AnyAsync(cancellationToken: cancellationToken))
            {
                return;
            }

            // 初始化数据
            var user = new User("admin", "AIDotNet", "Aa123456.", "239573049@qq.com", "13049809673",
                "AIDotNet Koala 管理员账号");

            await context.Users.AddAsync(user, cancellationToken);

            #region 初始化角色

            var role = new Role("管理员", "系统管理员", "admin");
            role.SetCreator(user.Id);
            await context.Roles.AddAsync(role, cancellationToken);

            var userRole = new UserRole(user.Id, role.Id);
            await context.UserRoles.AddAsync(userRole, cancellationToken);

            #endregion

            #region 初始化工作空间

            var workSpace = new WorkSpace("默认个人空间", "默认的个人空间");
            workSpace.SetCreator(user.Id);

            workSpace = (await context.WorkSpaces.AddAsync(workSpace, cancellationToken)).Entity;

            await context.SaveChangesAsync(cancellationToken);

            var workSpaceMember = new WorkSpaceMember(workSpace.Id, user.Id, WorkSpaceRoleType.Create);
            await context.WorkSpaceMembers.AddAsync(workSpaceMember, cancellationToken);

            #endregion

            #region 初始化模型提供者

            var userModelProvider = UserModelProvider.CreateDefault(user.Id);

            await context.UserModelProviders.AddAsync(userModelProvider, cancellationToken);

            #endregion


            await context.SaveChangesAsync(cancellationToken);
        }
    }
}