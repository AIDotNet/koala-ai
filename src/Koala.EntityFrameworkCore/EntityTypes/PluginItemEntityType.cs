using System.Text.Json;
using Koala.Core;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class PluginItemEntityType : IEntityTypeConfiguration<PluginItem>
{
    public void Configure(EntityTypeBuilder<PluginItem> builder)
    {
        builder.ToTable("plugin_items", (tableBuilder) => { tableBuilder.HasComment("插件项"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("插件项ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("插件项名称")
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasComment("插件项描述")
            .IsRequired();

        builder.HasIndex(x => x.PluginId);

        builder.HasOne(x => x.Plugin)
            .WithMany()
            .HasForeignKey(x => x.PluginId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(x => x.Parameters)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOptions.Options),
                v => JsonSerializer.Deserialize<List<PluginItemParameter>>(v, JsonOptions.Options) ??
                     new List<PluginItemParameter>()
            );

        builder.Property(x=>x.OutputParameters)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOptions.Options),
                v => JsonSerializer.Deserialize<List<PluginItemOutputParameter>>(v, JsonOptions.Options) ??
                     new List<PluginItemOutputParameter>()
            );
        
        builder.HasIndex(x => x.Name);
    }
}