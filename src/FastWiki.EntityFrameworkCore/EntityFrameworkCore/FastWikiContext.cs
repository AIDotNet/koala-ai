using FastWiki.Domain.Agents.Aggregates;
using FastWiki.Domain.Knowledges.Aggregates;
using FastWiki.Domain.Powers.Aggregates;
using FastWiki.Domain.Shared.WorkSpace;
using FastWiki.Domain.Users.Aggregates;
using FastWiki.Domain.WorkSpaces.Aggregates;
using Microsoft.Extensions.DependencyInjection;

namespace FastWiki.EntityFrameworkCore.EntityFrameworkCore;

public class FastWikiContext<TContext>(DbContextOptions<TContext> options) : DbContext(options), IContext
    where TContext : DbContext
{
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

    public DbSet<Knowledge> Knowledges { get; set; }

    public DbSet<KnowledgeItem> KnowledgeItems { get; set; }

    public DbSet<QuantizedTask> QuantizedTasks { get; set; }

    public DbSet<Role> Roles { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<UserAuthExtensions> UserAuthExtensions { get; set; }

    public DbSet<UserRole> UserRoles { get; set; }

    public async Task RunMigrationsAsync(IServiceProvider serviceProvider,
        CancellationToken cancellationToken = new CancellationToken())
    {
        await Database.MigrateAsync(cancellationToken);

        // 初始化数据
        await using var scope = serviceProvider.CreateAsyncScope();

        var dataInitializer = scope.ServiceProvider.GetRequiredService<IContext>();

        if (dataInitializer is FastWikiContext<TContext> context)
        {
            // 判断是否存在初始化数据
            if (await context.Users.AnyAsync(cancellationToken: cancellationToken))
            {
                return;
            }

            // 启动事务
            await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

            // 初始化数据
            var user = new User("admin", "AIDotNet", "Aa123456.", "239573049@qq.com", "13049809673",
                "AIDotNet FastWiki 管理员账号");

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

            await transaction.CommitAsync(cancellationToken);
        }
    }
}