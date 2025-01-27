using FastWiki.Domain.Agents.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FastWiki.EntityFrameworkCore.EntityTypeConfigurations;

public class AgentEntityType : IEntityTypeConfiguration<Agent>
{
    public void Configure(EntityTypeBuilder<Agent> builder)
    {
        builder.ToTable("agents", (tableBuilder) => { tableBuilder.HasComment("智能体"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("智能体ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("智能体名称")
            .HasMaxLength(100);

        builder.Property(x => x.Introduction)
            .HasComment("智能体介绍")
            .HasMaxLength(1000);

        builder.Property(x => x.Avatar)
            .HasComment("智能体头像")
            .HasMaxLength(1000);

        builder.HasIndex(x => x.WorkspaceId);

        builder.HasOne(x => x.WorkSpace)
            .WithMany()
            .HasForeignKey(x => x.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.Name);
    }
}