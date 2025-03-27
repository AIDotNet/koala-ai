using Koala.Domain.Plugins.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class PluginEntityType : IEntityTypeConfiguration<Plugin>
{
    public void Configure(EntityTypeBuilder<Plugin> builder)
    {
        builder.ToTable("plugins", (tableBuilder) => { tableBuilder.HasComment("插件"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("插件ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("插件名称")
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasComment("插件描述")
            .IsRequired();

        builder.Property(x => x.Avatar)
            .HasComment("插件头像")
            .HasMaxLength(1000);
        
        builder.HasIndex(x => x.WorkSpaceId);

        builder.HasOne(x => x.WorkSpace)
            .WithMany()
            .HasForeignKey(x => x.WorkSpaceId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasIndex(x => x.Name);
    }
}