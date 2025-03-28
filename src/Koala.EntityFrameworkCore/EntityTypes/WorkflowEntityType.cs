 using Koala.Domain.WorkFlows.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class WorkflowEntityType : IEntityTypeConfiguration<Workflow>
{
    public void Configure(EntityTypeBuilder<Workflow> builder)
    {
        builder.ToTable("workflows", (tableBuilder) => { tableBuilder.HasComment("工作流"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("工作流ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("工作流名称")
            .HasMaxLength(50);

        builder.Property(x => x.Description)
            .HasComment("工作流描述")
            .HasMaxLength(200);

        builder.Property(x => x.Version)
            .IsRequired()
            .HasComment("工作流版本")
            .HasDefaultValue(1);

        builder.Property(x => x.Status)
            .IsRequired()
            .HasComment("工作流状态")
            .HasDefaultValue(Domain.WorkFlows.Enums.WorkflowStatusEnum.Draft);

        builder.Property(x => x.Definition)
            .IsRequired()
            .HasComment("工作流定义（JSON格式）");

        builder.Property(x => x.AgentId)
            .HasComment("关联的智能体ID");

        builder.Property(x => x.WorkspaceId)
            .IsRequired()
            .HasComment("工作空间ID");

        builder.Property(x => x.Tags)
            .HasComment("标签（JSON数组格式）");

        builder.HasIndex(x => x.WorkspaceId);
        
        builder.HasIndex(x => x.Name);

        builder.HasOne(x => x.Workspace)
            .WithMany()
            .HasForeignKey(x => x.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Agent)
            .WithMany()
            .HasForeignKey(x => x.AgentId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}