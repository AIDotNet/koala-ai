using FastWiki.Domain.Knowledge.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FastWiki.EntityFrameworkCore.EntityTypeConfigurations;

public class CategoryEntityType : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories", (tableBuilder) => { tableBuilder.HasComment("分类"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("分类ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("分类名称")
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasComment("分类描述")
            .IsRequired();

        builder.HasIndex(x => x.WorkSpaceId);

        builder.HasOne(x => x.WorkSpace)
            .WithMany()
            .HasForeignKey(x => x.WorkSpaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.Name);
    }
}