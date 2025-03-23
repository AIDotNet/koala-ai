using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FastWiki.EntityFrameworkCore.Sqlite.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "chat_histories",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "聊天记录ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    SessionId = table.Column<string>(type: "TEXT", nullable: false, comment: "会话ID"),
                    Content = table.Column<string>(type: "TEXT", nullable: false, comment: "聊天内容"),
                    UserId = table.Column<string>(type: "TEXT", nullable: false, comment: "发送用户ID"),
                    IP = table.Column<string>(type: "TEXT", nullable: false, comment: "发送用户IP"),
                    AgentId = table.Column<string>(type: "TEXT", nullable: false, comment: "使用的智能体ID"),
                    SendMessage = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false, comment: "是否发送消息"),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chat_histories", x => x.Id);
                },
                comment: "聊天记录");

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false, comment: "角色ID"),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "角色名称"),
                    Description = table.Column<string>(type: "TEXT", nullable: false, comment: "角色描述"),
                    Code = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "角色编码 唯一"),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                },
                comment: "角色");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false, comment: "用户ID"),
                    Account = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "用户名"),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "密码"),
                    Salt = table.Column<string>(type: "TEXT", nullable: false),
                    Avatar = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "头像"),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "邮箱"),
                    Phone = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "手机号"),
                    Introduction = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "简介"),
                    IsDisable = table.Column<bool>(type: "INTEGER", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                },
                comment: "用户");

            migrationBuilder.CreateTable(
                name: "work_spaces",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "工作空间ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "工作空间名称"),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true, comment: "工作空间描述"),
                    State = table.Column<byte>(type: "INTEGER", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_work_spaces", x => x.Id);
                },
                comment: "工作空间");

            migrationBuilder.CreateTable(
                name: "user_auth_extensions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false, comment: "用户认证扩展ID"),
                    UserId = table.Column<string>(type: "TEXT", nullable: false, comment: "用户ID"),
                    AuthId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "认证ID"),
                    AuthType = table.Column<string>(type: "TEXT", nullable: false, comment: "认证类型"),
                    ExtendData = table.Column<string>(type: "TEXT", nullable: false, comment: "扩展数据")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_auth_extensions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_auth_extensions_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "用户认证扩展");

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false, comment: "用户ID"),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false, comment: "角色ID")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_user_roles_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "用户角色");

            migrationBuilder.CreateTable(
                name: "agents",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "智能体ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "智能体名称"),
                    Introduction = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "智能体介绍"),
                    Avatar = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "智能体头像"),
                    IsCollect = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsTop = table.Column<bool>(type: "INTEGER", nullable: false),
                    WorkspaceId = table.Column<long>(type: "INTEGER", nullable: true),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_agents_work_spaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "智能体");

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false, comment: "分类ID"),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "分类名称"),
                    Description = table.Column<string>(type: "TEXT", nullable: false, comment: "分类描述"),
                    ParentId = table.Column<string>(type: "TEXT", nullable: true),
                    WorkSpaceId = table.Column<long>(type: "INTEGER", nullable: true),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_categories_work_spaces_WorkSpaceId",
                        column: x => x.WorkSpaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "分类");

            migrationBuilder.CreateTable(
                name: "plugins",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "插件ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "插件名称"),
                    Description = table.Column<string>(type: "TEXT", nullable: false, comment: "插件描述"),
                    Runtime = table.Column<string>(type: "TEXT", nullable: false),
                    Avatar = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "插件头像"),
                    Enable = table.Column<bool>(type: "INTEGER", nullable: false),
                    WorkSpaceId = table.Column<long>(type: "INTEGER", nullable: true),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plugins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_plugins_work_spaces_WorkSpaceId",
                        column: x => x.WorkSpaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "插件");

            migrationBuilder.CreateTable(
                name: "work_space_members",
                columns: table => new
                {
                    WorkSpaceId = table.Column<long>(type: "INTEGER", nullable: false, comment: "工作空间ID"),
                    UserId = table.Column<string>(type: "TEXT", nullable: false, comment: "用户ID"),
                    RoleType = table.Column<byte>(type: "INTEGER", nullable: false),
                    Id = table.Column<long>(type: "INTEGER", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_work_space_members", x => new { x.WorkSpaceId, x.UserId });
                    table.ForeignKey(
                        name: "FK_work_space_members_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_work_space_members_work_spaces_WorkSpaceId",
                        column: x => x.WorkSpaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "工作空间成员");

            migrationBuilder.CreateTable(
                name: "agent_configs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "配置ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    AgentId = table.Column<long>(type: "INTEGER", nullable: false, comment: "智能体ID"),
                    Model = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, defaultValue: "gpt-4", comment: "对话模型"),
                    Temperature = table.Column<double>(type: "REAL", nullable: false, defaultValue: 0.69999999999999996, comment: "温度 (0-1) 越高越随机"),
                    TopP = table.Column<double>(type: "REAL", nullable: false, defaultValue: 0.90000000000000002, comment: "TopP (0-1) 越高越随机"),
                    MaxResponseToken = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 4000, comment: "最大回复token"),
                    OutputFormat = table.Column<string>(type: "TEXT", nullable: false, defaultValue: "markdown", comment: "输出格式"),
                    ContextSize = table.Column<int>(type: "INTEGER", nullable: false, defaultValue: 0, comment: "上下文数量"),
                    Opening = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true, defaultValue: "你好，我是AIDotNet智能助手，我可以帮助您解决问题，您可以问我任何问题。", comment: "开场白"),
                    SuggestUserQuestion = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false, comment: "是否提供用户建议提问"),
                    Prompt = table.Column<string>(type: "TEXT", maxLength: 4000, nullable: true, comment: "智能体提示词"),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agent_configs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_agent_configs_agents_AgentId",
                        column: x => x.AgentId,
                        principalTable: "agents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "智能体配置信息");

            migrationBuilder.CreateTable(
                name: "knowledges",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false, comment: "知识库ID"),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "知识库名称"),
                    Description = table.Column<string>(type: "TEXT", nullable: false, comment: "知识库描述"),
                    CategoryId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true, comment: "知识库分类"),
                    RagType = table.Column<byte>(type: "INTEGER", nullable: false, comment: "知识库 RAG 类型"),
                    Avatar = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "知识库头像"),
                    EmbeddingModel = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "知识库嵌入模型,当嵌入模型确认以后不能修改，否则会导致数据不一致"),
                    ChatModel = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "知识库聊天模型"),
                    WorkspaceId = table.Column<long>(type: "INTEGER", nullable: true),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_knowledges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_knowledges_categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_knowledges_work_spaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "知识库");

            migrationBuilder.CreateTable(
                name: "plugin_items",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "插件项ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    WorkSpaceId = table.Column<long>(type: "INTEGER", nullable: false),
                    PluginId = table.Column<long>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "插件项名称"),
                    Description = table.Column<string>(type: "TEXT", nullable: false, comment: "插件项描述"),
                    Parameters = table.Column<string>(type: "TEXT", nullable: false),
                    OutputParameters = table.Column<string>(type: "TEXT", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plugin_items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_plugin_items_plugins_PluginId",
                        column: x => x.PluginId,
                        principalTable: "plugins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_plugin_items_work_spaces_WorkSpaceId",
                        column: x => x.WorkSpaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "插件项");

            migrationBuilder.CreateTable(
                name: "knowledge_items",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "知识库条目ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    KnowledgeId = table.Column<string>(type: "TEXT", nullable: false, comment: "知识库ID"),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false, comment: "知识库条目名称"),
                    Data = table.Column<string>(type: "TEXT", nullable: false),
                    FileId = table.Column<string>(type: "TEXT", nullable: true),
                    DataCount = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    Enable = table.Column<bool>(type: "INTEGER", nullable: false),
                    ExtraData = table.Column<string>(type: "TEXT", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_knowledge_items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_knowledge_items_knowledges_KnowledgeId",
                        column: x => x.KnowledgeId,
                        principalTable: "knowledges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "知识库条目");

            migrationBuilder.CreateTable(
                name: "quantized_tasks",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false, comment: "量化任务ID")
                        .Annotation("Sqlite:Autoincrement", true),
                    KnowledgeId = table.Column<string>(type: "TEXT", nullable: false),
                    KnowledgeItemId = table.Column<long>(type: "INTEGER", nullable: false),
                    State = table.Column<byte>(type: "INTEGER", nullable: false, comment: "量化任务状态"),
                    Remark = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false, comment: "备注"),
                    ProcessTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_quantized_tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_quantized_tasks_knowledge_items_KnowledgeItemId",
                        column: x => x.KnowledgeItemId,
                        principalTable: "knowledge_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_quantized_tasks_knowledges_KnowledgeId",
                        column: x => x.KnowledgeId,
                        principalTable: "knowledges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "量化任务");

            migrationBuilder.CreateIndex(
                name: "IX_agent_configs_AgentId",
                table: "agent_configs",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_agents_Name",
                table: "agents",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_agents_WorkspaceId",
                table: "agents",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_categories_Name",
                table: "categories",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_categories_WorkSpaceId",
                table: "categories",
                column: "WorkSpaceId");

            migrationBuilder.CreateIndex(
                name: "IX_chat_histories_SessionId",
                table: "chat_histories",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_chat_histories_UserId",
                table: "chat_histories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_knowledge_items_KnowledgeId",
                table: "knowledge_items",
                column: "KnowledgeId");

            migrationBuilder.CreateIndex(
                name: "IX_knowledge_items_Name",
                table: "knowledge_items",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_knowledges_CategoryId",
                table: "knowledges",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_knowledges_Name",
                table: "knowledges",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_knowledges_WorkspaceId",
                table: "knowledges",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_plugin_items_Name",
                table: "plugin_items",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_plugin_items_PluginId",
                table: "plugin_items",
                column: "PluginId");

            migrationBuilder.CreateIndex(
                name: "IX_plugin_items_WorkSpaceId",
                table: "plugin_items",
                column: "WorkSpaceId");

            migrationBuilder.CreateIndex(
                name: "IX_plugins_Name",
                table: "plugins",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_plugins_WorkSpaceId",
                table: "plugins",
                column: "WorkSpaceId");

            migrationBuilder.CreateIndex(
                name: "IX_quantized_tasks_KnowledgeId",
                table: "quantized_tasks",
                column: "KnowledgeId");

            migrationBuilder.CreateIndex(
                name: "IX_quantized_tasks_KnowledgeItemId",
                table: "quantized_tasks",
                column: "KnowledgeItemId");

            migrationBuilder.CreateIndex(
                name: "IX_roles_Code",
                table: "roles",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_roles_Name",
                table: "roles",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_user_auth_extensions_AuthType_AuthId",
                table: "user_auth_extensions",
                columns: new[] { "AuthType", "AuthId" });

            migrationBuilder.CreateIndex(
                name: "IX_user_auth_extensions_UserId",
                table: "user_auth_extensions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_RoleId",
                table: "user_roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Account",
                table: "users",
                column: "Account",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Name",
                table: "users",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_users_Phone",
                table: "users",
                column: "Phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_work_space_members_UserId",
                table: "work_space_members",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_work_space_members_WorkSpaceId",
                table: "work_space_members",
                column: "WorkSpaceId");

            migrationBuilder.CreateIndex(
                name: "IX_work_space_members_WorkSpaceId_UserId",
                table: "work_space_members",
                columns: new[] { "WorkSpaceId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_work_spaces_Name",
                table: "work_spaces",
                column: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "agent_configs");

            migrationBuilder.DropTable(
                name: "chat_histories");

            migrationBuilder.DropTable(
                name: "plugin_items");

            migrationBuilder.DropTable(
                name: "quantized_tasks");

            migrationBuilder.DropTable(
                name: "user_auth_extensions");

            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropTable(
                name: "work_space_members");

            migrationBuilder.DropTable(
                name: "agents");

            migrationBuilder.DropTable(
                name: "plugins");

            migrationBuilder.DropTable(
                name: "knowledge_items");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "knowledges");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "work_spaces");
        }
    }
}
