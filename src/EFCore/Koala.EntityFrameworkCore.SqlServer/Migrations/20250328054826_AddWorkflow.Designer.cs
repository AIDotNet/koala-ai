﻿// <auto-generated />
using System;
using Koala.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Koala.EntityFrameworkCore.SqlServer.Migrations
{
    [DbContext(typeof(SqlServerDbContext))]
    [Migration("20250328054826_AddWorkflow")]
    partial class AddWorkflow
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Koala.Domain.Agents.Aggregates.Agent", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("智能体ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("智能体头像");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Introduction")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("智能体介绍");

                    b.Property<bool>("IsCollect")
                        .HasColumnType("bit");

                    b.Property<bool>("IsTop")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("智能体名称");

                    b.Property<long?>("WorkspaceId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.HasIndex("WorkspaceId");

                    b.ToTable("agents", null, t =>
                        {
                            t.HasComment("智能体");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Agents.Aggregates.AgentConfig", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("配置ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<long>("AgentId")
                        .HasColumnType("bigint")
                        .HasComment("智能体ID");

                    b.Property<int>("ContextSize")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0)
                        .HasComment("上下文数量");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("MaxResponseToken")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(4000)
                        .HasComment("最大回复token");

                    b.Property<string>("Model")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasDefaultValue("gpt-4")
                        .HasComment("对话模型");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Opening")
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(4000)
                        .HasColumnType("nvarchar(4000)")
                        .HasDefaultValue("你好，我是AIDotNet智能助手，我可以帮助您解决问题，您可以问我任何问题。")
                        .HasComment("开场白");

                    b.Property<string>("OutputFormat")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(max)")
                        .HasDefaultValue("markdown")
                        .HasComment("输出格式");

                    b.Property<string>("Prompt")
                        .HasMaxLength(4000)
                        .HasColumnType("nvarchar(4000)")
                        .HasComment("智能体提示词");

                    b.Property<bool>("SuggestUserQuestion")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false)
                        .HasComment("是否提供用户建议提问");

                    b.Property<double>("Temperature")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("float")
                        .HasDefaultValue(0.69999999999999996)
                        .HasComment("温度 (0-1) 越高越随机");

                    b.Property<double>("TopP")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("float")
                        .HasDefaultValue(0.90000000000000002)
                        .HasComment("TopP (0-1) 越高越随机");

                    b.HasKey("Id");

                    b.HasIndex("AgentId");

                    b.ToTable("agent_configs", null, t =>
                        {
                            t.HasComment("智能体配置信息");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Chat.Aggregates.ChatHistory", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("聊天记录ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("AgentId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("使用的智能体ID");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("聊天内容");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IP")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("发送用户IP");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("SendMessage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false)
                        .HasComment("是否发送消息");

                    b.Property<string>("SessionId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("会话ID");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("发送用户ID");

                    b.HasKey("Id");

                    b.HasIndex("SessionId");

                    b.HasIndex("UserId");

                    b.ToTable("chat_histories", null, t =>
                        {
                            t.HasComment("聊天记录");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Knowledge.Aggregates.Category", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("分类ID");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("分类描述");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("分类名称");

                    b.Property<string>("ParentId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("WorkSpaceId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.HasIndex("WorkSpaceId");

                    b.ToTable("categories", null, t =>
                        {
                            t.HasComment("分类");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Knowledge.Aggregates.KnowledgeItem", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("知识库条目ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Data")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("DataCount")
                        .HasColumnType("int");

                    b.Property<bool>("Enable")
                        .HasColumnType("bit");

                    b.Property<string>("ExtraData")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FileId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("KnowledgeId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("知识库ID");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("知识库条目名称");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("KnowledgeId");

                    b.HasIndex("Name");

                    b.ToTable("knowledge_items", null, t =>
                        {
                            t.HasComment("知识库条目");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Knowledge.Aggregates.KoalaKnowledge", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("知识库ID");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("知识库头像");

                    b.Property<string>("CategoryId")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("知识库分类");

                    b.Property<string>("ChatModel")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("知识库聊天模型");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("知识库描述");

                    b.Property<string>("EmbeddingModel")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("知识库嵌入模型,当嵌入模型确认以后不能修改，否则会导致数据不一致");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("知识库名称");

                    b.Property<byte>("RagType")
                        .HasColumnType("tinyint")
                        .HasComment("知识库 RAG 类型");

                    b.Property<long?>("WorkspaceId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("Name");

                    b.HasIndex("WorkspaceId");

                    b.ToTable("knowledges", null, t =>
                        {
                            t.HasComment("知识库");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Knowledges.Aggregates.QuantizedTask", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("量化任务ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("KnowledgeId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<long>("KnowledgeItemId")
                        .HasColumnType("bigint");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset>("ProcessTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Remark")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("备注");

                    b.Property<byte>("State")
                        .HasColumnType("tinyint")
                        .HasComment("量化任务状态");

                    b.HasKey("Id");

                    b.HasIndex("KnowledgeId");

                    b.HasIndex("KnowledgeItemId");

                    b.ToTable("quantized_tasks", null, t =>
                        {
                            t.HasComment("量化任务");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Plugins.Aggregates.Plugin", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("插件ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("插件头像");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("插件描述");

                    b.Property<bool>("Enable")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("插件名称");

                    b.Property<string>("Runtime")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("WorkSpaceId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.HasIndex("WorkSpaceId");

                    b.ToTable("plugins", null, t =>
                        {
                            t.HasComment("插件");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Plugins.Aggregates.PluginItem", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("插件项ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("插件项描述");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("插件项名称");

                    b.Property<string>("OutputParameters")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Parameters")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("PluginId")
                        .HasColumnType("bigint");

                    b.Property<long>("WorkSpaceId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.HasIndex("PluginId");

                    b.HasIndex("WorkSpaceId");

                    b.ToTable("plugin_items", null, t =>
                        {
                            t.HasComment("插件项");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Powers.Aggregates.Role", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("角色ID");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("角色编码 唯一");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("角色描述");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("角色名称");

                    b.HasKey("Id");

                    b.HasIndex("Code")
                        .IsUnique();

                    b.HasIndex("Name");

                    b.ToTable("roles", null, t =>
                        {
                            t.HasComment("角色");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Powers.Aggregates.UserRole", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)")
                        .HasComment("用户ID");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)")
                        .HasComment("角色ID");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("user_roles", null, t =>
                        {
                            t.HasComment("用户角色");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Users.Aggregates.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("用户ID");

                    b.Property<string>("Account")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("用户名");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("头像");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("邮箱");

                    b.Property<string>("Introduction")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("简介");

                    b.Property<bool>("IsDisable")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("密码");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("手机号");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("Account")
                        .IsUnique();

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Name");

                    b.HasIndex("Phone")
                        .IsUnique();

                    b.ToTable("users", null, t =>
                        {
                            t.HasComment("用户");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Users.Aggregates.UserAuthExtensions", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("用户认证扩展ID");

                    b.Property<string>("AuthId")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("认证ID");

                    b.Property<string>("AuthType")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("认证类型");

                    b.Property<string>("ExtendData")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)")
                        .HasComment("扩展数据");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)")
                        .HasComment("用户ID");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.HasIndex("AuthType", "AuthId");

                    b.ToTable("user_auth_extensions", null, t =>
                        {
                            t.HasComment("用户认证扩展");
                        });
                });

            modelBuilder.Entity("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasComment("工作空间ID");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<long>("Id"));

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)")
                        .HasComment("工作空间描述");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)")
                        .HasComment("工作空间名称");

                    b.Property<byte>("State")
                        .HasColumnType("tinyint");

                    b.HasKey("Id");

                    b.HasIndex("Name");

                    b.ToTable("work_spaces", null, t =>
                        {
                            t.HasComment("工作空间");
                        });
                });

            modelBuilder.Entity("Koala.Domain.WorkSpaces.Aggregates.WorkSpaceMember", b =>
                {
                    b.Property<long>("WorkSpaceId")
                        .HasColumnType("bigint")
                        .HasComment("工作空间ID");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)")
                        .HasComment("用户ID");

                    b.Property<DateTimeOffset?>("CreationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Creator")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("Id")
                        .HasColumnType("bigint");

                    b.Property<DateTimeOffset?>("ModificationTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Modifier")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte>("RoleType")
                        .HasColumnType("tinyint");

                    b.HasKey("WorkSpaceId", "UserId");

                    b.HasIndex("UserId");

                    b.HasIndex("WorkSpaceId");

                    b.HasIndex("WorkSpaceId", "UserId")
                        .IsUnique();

                    b.ToTable("work_space_members", null, t =>
                        {
                            t.HasComment("工作空间成员");
                        });
                });

            modelBuilder.Entity("Koala.Domain.Agents.Aggregates.Agent", b =>
                {
                    b.HasOne("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", "WorkSpace")
                        .WithMany()
                        .HasForeignKey("WorkspaceId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("WorkSpace");
                });

            modelBuilder.Entity("Koala.Domain.Agents.Aggregates.AgentConfig", b =>
                {
                    b.HasOne("Koala.Domain.Agents.Aggregates.Agent", "Agent")
                        .WithMany()
                        .HasForeignKey("AgentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Agent");
                });

            modelBuilder.Entity("Koala.Domain.Knowledge.Aggregates.Category", b =>
                {
                    b.HasOne("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", "WorkSpace")
                        .WithMany()
                        .HasForeignKey("WorkSpaceId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("WorkSpace");
                });

            modelBuilder.Entity("Koala.Domain.Knowledge.Aggregates.KnowledgeItem", b =>
                {
                    b.HasOne("Koala.Domain.Knowledge.Aggregates.KoalaKnowledge", "Knowledge")
                        .WithMany()
                        .HasForeignKey("KnowledgeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Knowledge");
                });

            modelBuilder.Entity("Koala.Domain.Knowledge.Aggregates.KoalaKnowledge", b =>
                {
                    b.HasOne("Koala.Domain.Knowledge.Aggregates.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", "WorkSpace")
                        .WithMany()
                        .HasForeignKey("WorkspaceId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Category");

                    b.Navigation("WorkSpace");
                });

            modelBuilder.Entity("Koala.Domain.Knowledges.Aggregates.QuantizedTask", b =>
                {
                    b.HasOne("Koala.Domain.Knowledge.Aggregates.KoalaKnowledge", "Knowledge")
                        .WithMany()
                        .HasForeignKey("KnowledgeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Koala.Domain.Knowledge.Aggregates.KnowledgeItem", "KnowledgeItem")
                        .WithMany()
                        .HasForeignKey("KnowledgeItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Knowledge");

                    b.Navigation("KnowledgeItem");
                });

            modelBuilder.Entity("Koala.Domain.Plugins.Aggregates.Plugin", b =>
                {
                    b.HasOne("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", "WorkSpace")
                        .WithMany()
                        .HasForeignKey("WorkSpaceId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("WorkSpace");
                });

            modelBuilder.Entity("Koala.Domain.Plugins.Aggregates.PluginItem", b =>
                {
                    b.HasOne("Koala.Domain.Plugins.Aggregates.Plugin", "Plugin")
                        .WithMany()
                        .HasForeignKey("PluginId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", "WorkSpace")
                        .WithMany()
                        .HasForeignKey("WorkSpaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Plugin");

                    b.Navigation("WorkSpace");
                });

            modelBuilder.Entity("Koala.Domain.Powers.Aggregates.UserRole", b =>
                {
                    b.HasOne("Koala.Domain.Powers.Aggregates.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Koala.Domain.Users.Aggregates.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Koala.Domain.Users.Aggregates.UserAuthExtensions", b =>
                {
                    b.HasOne("Koala.Domain.Users.Aggregates.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Koala.Domain.WorkSpaces.Aggregates.WorkSpaceMember", b =>
                {
                    b.HasOne("Koala.Domain.Users.Aggregates.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Koala.Domain.WorkSpaces.Aggregates.WorkSpace", "WorkSpace")
                        .WithMany()
                        .HasForeignKey("WorkSpaceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");

                    b.Navigation("WorkSpace");
                });
#pragma warning restore 612, 618
        }
    }
}
