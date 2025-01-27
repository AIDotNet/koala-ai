using FastWiki.Domain.Knowledge.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FastWiki.EntityFrameworkCore.EntityTypeConfigurations;

public class KnowledgeEntityType : IEntityTypeConfiguration<FastWikiKnowledge>
{
    public void Configure(EntityTypeBuilder<FastWikiKnowledge> builder)
    {
        builder.ToTable("knowledges", (tableBuilder) => { tableBuilder.HasComment("知识库"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("知识库ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("知识库名称")
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasComment("知识库描述")
            .IsRequired();

        builder.Property(x => x.CategoryId)
            .HasComment("知识库分类")
            .HasMaxLength(100);

        builder.HasIndex(x => x.CategoryId);

        builder.Property(x => x.RagType)
            .HasComment("知识库 RAG 类型")
            .IsRequired();

        builder.HasIndex(x => x.WorkspaceId);

        builder.Property(x => x.Avatar)
            .IsRequired()
            .HasComment("知识库头像")
            .HasMaxLength(1000);

        builder.Property(x => x.EmbeddingModel)
            .IsRequired()
            .HasComment("知识库嵌入模型,当嵌入模型确认以后不能修改，否则会导致数据不一致")
            .HasMaxLength(100);

        builder.Property(x => x.ChatModel)
            .IsRequired()
            .HasComment("知识库聊天模型")
            .HasMaxLength(100);

        builder.HasOne(x => x.Category)
            .WithMany()
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.WorkSpace)
            .WithMany()
            .HasForeignKey(x => x.WorkspaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.Name);
    }
}