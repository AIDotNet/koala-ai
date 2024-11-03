using FastWiki.Domain.Agents.Aggregates;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FastWiki.EntityFrameworkCore.EntityTypeConfigurations;

public class AgentConfigEntityType : IEntityTypeConfiguration<AgentConfig>
{
    public void Configure(EntityTypeBuilder<AgentConfig> builder)
    {
        builder.ToTable("agent_configs", (tableBuilder) => { tableBuilder.HasComment("智能体配置信息"); });

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .HasComment("配置ID")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.AgentId)
            .HasComment("智能体ID")
            .IsRequired();

        builder.Property(x => x.Opening)
            .HasComment("开场白")
            .HasMaxLength(4000);

        builder.Property(x => x.Model)
            .HasComment("对话模型")
            .HasMaxLength(100);

        builder.HasIndex(x => x.AgentId);

        builder.HasOne(x => x.Agent)
            .WithMany()
            .HasForeignKey(x => x.AgentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.AgentId);

        builder.Property(x => x.ContextSize)
            .HasComment("上下文数量")
            .HasDefaultValue(0);

        builder.Property(x => x.MaxResponseToken)
            .HasComment("最大回复token")
            .HasDefaultValue(4000);

        builder.Property(x => x.OutputFormat)
            .HasComment("输出格式")
            .HasDefaultValue("markdown");

        builder.Property(x => x.Prompt)
            .HasComment("智能体提示词")
            .HasMaxLength(4000);

        builder.Property(x => x.SuggestUserQuestion)
            .HasComment("是否提供用户建议提问")
            .HasDefaultValue(false);

        builder.Property(x => x.Temperature)
            .HasComment("温度 (0-1) 越高越随机")
            .HasDefaultValue(0.7);

        builder.Property(x => x.TopP)
            .HasComment("TopP (0-1) 越高越随机")
            .HasDefaultValue(0.9);

        builder.Property(x => x.Model)
            .HasDefaultValue("gpt-4");

        builder.Property(x => x.Opening)
            .HasDefaultValue("你好，我是AIDotNet智能助手，我可以帮助您解决问题，您可以问我任何问题。");
    }
}