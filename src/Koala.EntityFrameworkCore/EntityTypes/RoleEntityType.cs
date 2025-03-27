using Koala.Domain.Powers.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class RoleEntityType : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("roles", (tableBuilder) => { tableBuilder.HasComment("角色"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("角色ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("角色名称")
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasComment("角色描述")
            .IsRequired();

        builder.Property(x => x.Code)
            .IsRequired()
            .HasComment("角色编码 唯一")
            .HasMaxLength(100);
        
        builder.HasIndex(x => x.Code)
            .IsUnique();

        builder.HasIndex(x => x.Name);
    }
}