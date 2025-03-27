using Koala.Domain.Knowledges.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class QuantizedTaskEntityType : IEntityTypeConfiguration<QuantizedTask>
{
    public void Configure(EntityTypeBuilder<QuantizedTask> builder)
    {
        builder.ToTable("quantized_tasks", (tableBuilder) => { tableBuilder.HasComment("量化任务"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("量化任务ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Remark)
            .IsRequired()
            .HasComment("备注")
            .HasMaxLength(1000);

        builder.Property(x => x.State)
            .HasComment("量化任务状态")
            .IsRequired();

        builder.HasIndex(x => x.KnowledgeId);
        builder.HasOne(x => x.Knowledge)
            .WithMany()
            .HasForeignKey(x => x.KnowledgeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.KnowledgeItemId);

        builder.HasOne(x => x.KnowledgeItem)
            .WithMany()
            .HasForeignKey(x => x.KnowledgeItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}