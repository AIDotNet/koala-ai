 using Koala.Domain.WorkFlows.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class WorkflowInstanceEntityType : IEntityTypeConfiguration<WorkflowInstance>
{
    public void Configure(EntityTypeBuilder<WorkflowInstance> builder)
    {
        builder.ToTable("workflow_instances", (tableBuilder) => { tableBuilder.HasComment("工作流实例"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("实例ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.ReferenceId)
            .IsRequired()
            .HasComment("实例参考ID")
            .HasMaxLength(100);

        builder.Property(x => x.WorkflowId)
            .IsRequired()
            .HasComment("工作流ID");

        builder.Property(x => x.WorkflowVersion)
            .IsRequired()
            .HasComment("工作流版本号");

        builder.Property(x => x.Status)
            .IsRequired()
            .HasComment("实例状态")
            .HasDefaultValue(Domain.WorkFlows.Enums.WorkflowInstanceStatusEnum.Running);

        builder.Property(x => x.Data)
            .HasComment("实例数据（JSON格式）");

        builder.Property(x => x.CurrentNodeId)
            .HasComment("当前活动节点ID")
            .HasMaxLength(100);

        builder.Property(x => x.StartTime)
            .IsRequired()
            .HasComment("开始时间");

        builder.Property(x => x.EndTime)
            .HasComment("结束时间");

        builder.Property(x => x.ErrorMessage)
            .HasComment("错误信息");

        builder.Property(x => x.WorkflowCoreInstanceId)
            .HasComment("Workflow Core实例ID")
            .HasMaxLength(100);

        builder.HasIndex(x => x.WorkflowId);
        builder.HasIndex(x => x.ReferenceId);
        builder.HasIndex(x => x.Status);

        builder.HasOne(x => x.Workflow)
            .WithMany()
            .HasForeignKey(x => x.WorkflowId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}