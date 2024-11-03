using FastWiki.Domain.Chat.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FastWiki.EntityFrameworkCore.EntityTypeConfigurations;

public class ChatHistoryEntityType : IEntityTypeConfiguration<ChatHistory>
{
    public void Configure(EntityTypeBuilder<ChatHistory> builder)
    {
        builder.ToTable("chat_histories", (tableBuilder) => { tableBuilder.HasComment("聊天记录"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("聊天记录ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.SessionId)
            .HasComment("会话ID")
            .IsRequired();

        builder.Property(x => x.Content)
            .HasComment("聊天内容")
            .IsRequired();

        builder.Property(x => x.UserId)
            .HasComment("发送用户ID")
            .IsRequired();

        builder.Property(x => x.IP)
            .HasComment("发送用户IP")
            .IsRequired();

        builder.Property(x => x.AgentId)
            .HasComment("使用的智能体ID")
            .IsRequired();

        builder.Property(x => x.SendMessage)
            .HasComment("是否发送消息")
            .HasDefaultValue(false);

        builder.HasIndex(x => x.SessionId);

        builder.HasIndex(x => x.UserId);
    }
}