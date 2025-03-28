 using Koala.Domain.WorkFlows.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class WorkflowConnectionEntityType : IEntityTypeConfiguration<WorkflowConnection>
{
    public void Configure(EntityTypeBuilder<WorkflowConnection> builder)
    {
        builder.ToTable("workflow_connections", (tableBuilder) => { tableBuilder.HasComment("工作流连接"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("连接ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.ConnectionId)
            .IsRequired()
            .HasComment("连接ID（在工作流内唯一）")
            .HasMaxLength(100);

        builder.Property(x => x.Name)
            .HasComment("连接名称")
            .HasMaxLength(50);

        builder.Property(x => x.WorkflowId)
            .IsRequired()
            .HasComment("工作流ID");

        builder.Property(x => x.SourceNodeId)
            .IsRequired()
            .HasComment("源节点ID");

        builder.Property(x => x.TargetNodeId)
            .IsRequired()
            .HasComment("目标节点ID");

        builder.Property(x => x.ConnectionType)
            .IsRequired()
            .HasComment("连接类型")
            .HasDefaultValue(Domain.WorkFlows.Enums.ConnectionTypeEnum.Default);

        builder.Property(x => x.Condition)
            .HasComment("条件表达式");

        builder.HasIndex(x => x.WorkflowId);
        builder.HasIndex(x => new { x.WorkflowId, x.ConnectionId }).IsUnique();

        builder.HasOne(x => x.Workflow)
            .WithMany()
            .HasForeignKey(x => x.WorkflowId)
            .OnDelete(DeleteBehavior.Cascade);

        // 修复导航属性关系配置，使用明确的关系而不是隐式关系
        builder.HasOne(x => x.SourceNode)
            .WithMany() // 移除对OutgoingConnections的引用
            .HasForeignKey(x => x.SourceNodeId)
            .OnDelete(DeleteBehavior.NoAction); // 使用NoAction避免循环删除

        builder.HasOne(x => x.TargetNode)
            .WithMany() // 移除对IncomingConnections的引用
            .HasForeignKey(x => x.TargetNodeId)
            .OnDelete(DeleteBehavior.NoAction); // 使用NoAction避免循环删除
    }
}