using Koala.Domain.WorkSpaces.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class WorkSpaceEntityType : IEntityTypeConfiguration<WorkSpace>, IEntityTypeConfiguration<WorkSpaceMember>
{
    public void Configure(EntityTypeBuilder<WorkSpace> builder)
    {
        builder.ToTable("work_spaces", (tableBuilder) => { tableBuilder.HasComment("工作空间"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("工作空间ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("工作空间名称")
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasComment("工作空间描述")
            .HasMaxLength(1000);

        builder.HasIndex(x => x.Name);
    }

    public void Configure(EntityTypeBuilder<WorkSpaceMember> builder)
    {
        builder.ToTable("work_space_members", (tableBuilder) => { tableBuilder.HasComment("工作空间成员"); });

        builder.HasKey(x => new { x.WorkSpaceId, x.UserId });

        builder.Property(x => x.WorkSpaceId)
            .IsRequired()
            .HasComment("工作空间ID");

        builder.Property(x => x.UserId)
            .IsRequired()
            .HasComment("用户ID");

        builder.HasOne(x => x.WorkSpace)
            .WithMany()
            .HasForeignKey(x => x.WorkSpaceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        
        builder.HasIndex(x => new { x.WorkSpaceId, x.UserId })
            .IsUnique();
        
        builder.HasIndex(x => x.UserId);
        
        builder.HasIndex(x => x.WorkSpaceId);
        
    }
}