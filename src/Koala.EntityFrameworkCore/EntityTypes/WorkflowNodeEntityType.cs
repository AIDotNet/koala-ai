 using Koala.Domain.WorkFlows.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class WorkflowNodeEntityType : IEntityTypeConfiguration<WorkflowNode>
{
    public void Configure(EntityTypeBuilder<WorkflowNode> builder)
    {
        builder.ToTable("workflow_nodes", (tableBuilder) => { tableBuilder.HasComment("工作流节点"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("节点ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.NodeId)
            .IsRequired()
            .HasComment("节点ID（在工作流内唯一）")
            .HasMaxLength(100);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("节点名称")
            .HasMaxLength(50);

        builder.Property(x => x.NodeType)
            .IsRequired()
            .HasComment("节点类型");

        builder.Property(x => x.Configuration)
            .HasComment("节点配置（JSON格式）");

        builder.Property(x => x.WorkflowId)
            .IsRequired()
            .HasComment("工作流ID");

        builder.Property(x => x.PositionX)
            .IsRequired()
            .HasComment("位置X坐标")
            .HasDefaultValue(0);

        builder.Property(x => x.PositionY)
            .IsRequired()
            .HasComment("位置Y坐标")
            .HasDefaultValue(0);

        builder.HasIndex(x => x.WorkflowId);
        builder.HasIndex(x => new { x.WorkflowId, x.NodeId }).IsUnique();

        builder.HasOne(x => x.Workflow)
            .WithMany(w => w.Nodes)
            .HasForeignKey(x => x.WorkflowId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // 忽略导航属性，避免循环引用
        builder.Ignore(x => x.OutgoingConnections);
        builder.Ignore(x => x.IncomingConnections);
    }
}