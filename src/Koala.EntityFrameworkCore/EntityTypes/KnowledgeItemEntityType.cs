using System.Text.Json;
using Koala.Core;
using Koala.Domain.Knowledge.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class KnowledgeItemEntityType : IEntityTypeConfiguration<KnowledgeItem>
{
    public void Configure(EntityTypeBuilder<KnowledgeItem> builder)
    {
        builder.ToTable("knowledge_items", (tableBuilder) => { tableBuilder.HasComment("知识库条目"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("知识库条目ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.KnowledgeId)
            .HasComment("知识库ID")
            .IsRequired();

        builder.Property(x => x.Name)
            .HasComment("知识库条目名称")
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(x => x.KnowledgeId);

        builder.Property(x => x.ExtraData)
            .HasConversion((v) => JsonSerializer.Serialize(v, JsonOptions.Options),
                (v) =>JsonSerializer.Deserialize<Dictionary<string, string>>(v, JsonOptions.Options) ??
                    new Dictionary<string, string>());

        builder.HasOne(x => x.Knowledge)
            .WithMany()
            .HasForeignKey(x => x.KnowledgeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.Name);
    }
}