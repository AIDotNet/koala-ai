using System.Text.Json;
using Koala.Domain.Users.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public sealed class UserModelProviderEntityType : IEntityTypeConfiguration<UserModelProvider>
{
    public void Configure(EntityTypeBuilder<UserModelProvider> builder)
    {
        builder.ToTable("user_model_providers", (tableBuilder) => { tableBuilder.HasComment("用户模型提供者"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("用户模型提供者ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasComment("名称");

        builder.Property(x => x.Description)
            .HasComment("描述");

        builder.Property(x => x.ModelType)
            .IsRequired()
            .HasComment("模型类型");

        builder.HasIndex(x => x.Creator);

        builder.HasIndex(x => x.Name)
            .IsUnique()
            .HasDatabaseName("IX_UserModelProvider_Name");

        builder.HasIndex(x => x.ModelType)
            .IsUnique();

        builder.Property(x => x.ApiKey)
            .IsRequired()
            .HasComment("API密钥");

        builder.Property(x => x.Endpoint)
            .IsRequired()
            .HasComment("API端点");

        builder.Property(x => x.ModelIds)
            .HasConversion(x => JsonSerializer.Serialize(x, JsonSerializerOptions.Web),
                x => JsonSerializer.Deserialize<List<string>>(x, JsonSerializerOptions.Web));
    }
}