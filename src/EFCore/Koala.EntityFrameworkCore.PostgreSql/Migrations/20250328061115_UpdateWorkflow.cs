using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Koala.EntityFrameworkCore.PostgreSql.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "workflows",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false, comment: "工作流ID")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, comment: "工作流名称"),
                    Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true, comment: "工作流描述"),
                    Version = table.Column<int>(type: "integer", nullable: false, defaultValue: 1, comment: "工作流版本"),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0, comment: "工作流状态"),
                    Definition = table.Column<string>(type: "text", nullable: false, comment: "工作流定义（JSON格式）"),
                    AgentId = table.Column<long>(type: "bigint", nullable: true, comment: "关联的智能体ID"),
                    WorkspaceId = table.Column<long>(type: "bigint", nullable: false, comment: "工作空间ID"),
                    Tags = table.Column<string>(type: "text", nullable: true, comment: "标签（JSON数组格式）"),
                    Creator = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Modifier = table.Column<string>(type: "text", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflows_agents_AgentId",
                        column: x => x.AgentId,
                        principalTable: "agents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_workflows_work_spaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "work_spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "工作流");

            migrationBuilder.CreateTable(
                name: "workflow_instances",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false, comment: "实例ID")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ReferenceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false, comment: "实例参考ID"),
                    WorkflowId = table.Column<long>(type: "bigint", nullable: false, comment: "工作流ID"),
                    WorkflowVersion = table.Column<int>(type: "integer", nullable: false, comment: "工作流版本号"),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0, comment: "实例状态"),
                    Data = table.Column<string>(type: "text", nullable: true, comment: "实例数据（JSON格式）"),
                    CurrentNodeId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true, comment: "当前活动节点ID"),
                    StartTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, comment: "开始时间"),
                    EndTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true, comment: "结束时间"),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true, comment: "错误信息"),
                    WorkflowCoreInstanceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true, comment: "Workflow Core实例ID"),
                    Creator = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Modifier = table.Column<string>(type: "text", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_instances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflow_instances_workflows_WorkflowId",
                        column: x => x.WorkflowId,
                        principalTable: "workflows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "工作流实例");

            migrationBuilder.CreateTable(
                name: "workflow_nodes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false, comment: "节点ID")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NodeId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false, comment: "节点ID（在工作流内唯一）"),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, comment: "节点名称"),
                    NodeType = table.Column<int>(type: "integer", nullable: false, comment: "节点类型"),
                    Configuration = table.Column<string>(type: "text", nullable: true, comment: "节点配置（JSON格式）"),
                    WorkflowId = table.Column<long>(type: "bigint", nullable: false, comment: "工作流ID"),
                    PositionX = table.Column<double>(type: "double precision", nullable: false, defaultValue: 0.0, comment: "位置X坐标"),
                    PositionY = table.Column<double>(type: "double precision", nullable: false, defaultValue: 0.0, comment: "位置Y坐标"),
                    Creator = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Modifier = table.Column<string>(type: "text", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_nodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflow_nodes_workflows_WorkflowId",
                        column: x => x.WorkflowId,
                        principalTable: "workflows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "工作流节点");

            migrationBuilder.CreateTable(
                name: "workflow_connections",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false, comment: "连接ID")
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ConnectionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false, comment: "连接ID（在工作流内唯一）"),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true, comment: "连接名称"),
                    WorkflowId = table.Column<long>(type: "bigint", nullable: false, comment: "工作流ID"),
                    SourceNodeId = table.Column<long>(type: "bigint", nullable: false, comment: "源节点ID"),
                    TargetNodeId = table.Column<long>(type: "bigint", nullable: false, comment: "目标节点ID"),
                    ConnectionType = table.Column<int>(type: "integer", nullable: false, defaultValue: 0, comment: "连接类型"),
                    Condition = table.Column<string>(type: "text", nullable: true, comment: "条件表达式"),
                    Creator = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    Modifier = table.Column<string>(type: "text", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_connections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflow_connections_workflow_nodes_SourceNodeId",
                        column: x => x.SourceNodeId,
                        principalTable: "workflow_nodes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_workflow_connections_workflow_nodes_TargetNodeId",
                        column: x => x.TargetNodeId,
                        principalTable: "workflow_nodes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_workflow_connections_workflows_WorkflowId",
                        column: x => x.WorkflowId,
                        principalTable: "workflows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                },
                comment: "工作流连接");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_connections_SourceNodeId",
                table: "workflow_connections",
                column: "SourceNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_connections_TargetNodeId",
                table: "workflow_connections",
                column: "TargetNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_connections_WorkflowId",
                table: "workflow_connections",
                column: "WorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_connections_WorkflowId_ConnectionId",
                table: "workflow_connections",
                columns: new[] { "WorkflowId", "ConnectionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_workflow_instances_ReferenceId",
                table: "workflow_instances",
                column: "ReferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_instances_Status",
                table: "workflow_instances",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_instances_WorkflowId",
                table: "workflow_instances",
                column: "WorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_nodes_WorkflowId",
                table: "workflow_nodes",
                column: "WorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_nodes_WorkflowId_NodeId",
                table: "workflow_nodes",
                columns: new[] { "WorkflowId", "NodeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_workflows_AgentId",
                table: "workflows",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_workflows_Name",
                table: "workflows",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_workflows_WorkspaceId",
                table: "workflows",
                column: "WorkspaceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "workflow_connections");

            migrationBuilder.DropTable(
                name: "workflow_instances");

            migrationBuilder.DropTable(
                name: "workflow_nodes");

            migrationBuilder.DropTable(
                name: "workflows");
        }
    }
}
