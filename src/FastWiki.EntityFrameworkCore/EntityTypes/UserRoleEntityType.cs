using FastWiki.Domain.Powers.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FastWiki.EntityFrameworkCore.EntityTypeConfigurations;

public class UserRoleEntityType : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles", (tableBuilder) => { tableBuilder.HasComment("用户角色"); });

        builder.HasKey(x => new { x.UserId, x.RoleId });

        builder.Property(x => x.UserId)
            .IsRequired()
            .HasComment("用户ID");

        builder.Property(x => x.RoleId)
            .IsRequired()
            .HasComment("角色ID");
    }
}