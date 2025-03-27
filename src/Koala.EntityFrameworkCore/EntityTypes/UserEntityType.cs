using Koala.Core;
using Koala.Domain.Users.Aggregates;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Koala.EntityFrameworkCore.EntityTypeConfigurations;

public class UserEntityType : IEntityTypeConfiguration<User>, IEntityTypeConfiguration<UserAuthExtensions>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users", (tableBuilder) => { tableBuilder.HasComment("用户"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("用户ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.Account)
            .IsRequired()
            .HasComment("用户名")
            .HasMaxLength(100);

        builder.Property(x => x.Password)
            .IsRequired()
            .HasComment("密码")
            .HasMaxLength(100);

        builder.Property(x => x.Avatar)
            .HasComment("头像")
            .HasMaxLength(1000);

        builder.Property(x => x.Email)
            .HasComment("邮箱")
            .HasMaxLength(100);

        builder.Property(x => x.Phone)
            .HasComment("手机号")
            .HasMaxLength(100);

        builder.Property(x => x.Introduction)
            .HasComment("简介")
            .HasMaxLength(1000);

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.HasIndex(x => x.Account)
            .IsUnique();

        builder.HasIndex(x => x.Phone)
            .IsUnique();

        builder.HasIndex(x => x.Name);
    }

    public void Configure(EntityTypeBuilder<UserAuthExtensions> builder)
    {
        builder.ToTable("user_auth_extensions", (tableBuilder) => { tableBuilder.HasComment("用户认证扩展"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("用户认证扩展ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.UserId)
            .IsRequired()
            .HasComment("用户ID");

        builder.Property(x => x.AuthType)
            .IsRequired()
            .HasComment("认证类型");

        builder.Property(x => x.AuthId)
            .IsRequired()
            .HasComment("认证ID")
            .HasMaxLength(100);

        builder.Property(x => x.ExtendData)
            .HasComment("扩展数据")
            .HasConversion((v) => System.Text.Json.JsonSerializer.Serialize(v, JsonOptions.Options),
                (v) =>
                    System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(v, JsonOptions.Options) ??
                    new Dictionary<string, string>());

        builder.HasIndex(x => x.UserId);

        builder.HasIndex(x => new { x.AuthType, x.AuthId });

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}