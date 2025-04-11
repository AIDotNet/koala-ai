using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Koala.EntityFrameworkCore.Sqlite.Migrations
{
    /// <inheritdoc />
    public partial class UserModelProvider : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "user_model_providers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false, comment: "用户模型提供者ID"),
                    Name = table.Column<string>(type: "TEXT", nullable: false, comment: "名称"),
                    Description = table.Column<string>(type: "TEXT", nullable: false, comment: "描述"),
                    ModelType = table.Column<string>(type: "TEXT", nullable: false, comment: "模型类型"),
                    ApiKey = table.Column<string>(type: "TEXT", nullable: false, comment: "API密钥"),
                    Endpoint = table.Column<string>(type: "TEXT", nullable: false, comment: "API端点"),
                    ModelIds = table.Column<string>(type: "TEXT", nullable: false),
                    Enabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    Creator = table.Column<string>(type: "TEXT", nullable: true),
                    CreationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    Modifier = table.Column<string>(type: "TEXT", nullable: true),
                    ModificationTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_model_providers", x => x.Id);
                },
                comment: "用户模型提供者");

            migrationBuilder.CreateIndex(
                name: "IX_user_model_providers_Creator",
                table: "user_model_providers",
                column: "Creator");

            migrationBuilder.CreateIndex(
                name: "IX_user_model_providers_ModelType",
                table: "user_model_providers",
                column: "ModelType",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserModelProvider_Name",
                table: "user_model_providers",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "user_model_providers");
        }
    }
}
