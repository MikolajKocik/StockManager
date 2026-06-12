using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMaintenancePanel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaintenanceAssets",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastServiceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BinLocationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceAssets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaintenanceAssets_BinLocations_BinLocationId",
                        column: x => x.BinLocationId,
                        principalSchema: "StockManager",
                        principalTable: "BinLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceIncidents",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhotoUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResolvedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ReportedById = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AssignedToId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    BinLocationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceIncidents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaintenanceIncidents_AspNetUsers_AssignedToId",
                        column: x => x.AssignedToId,
                        principalSchema: "StockManager",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MaintenanceIncidents_AspNetUsers_ReportedById",
                        column: x => x.ReportedById,
                        principalSchema: "StockManager",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MaintenanceIncidents_BinLocations_BinLocationId",
                        column: x => x.BinLocationId,
                        principalSchema: "StockManager",
                        principalTable: "BinLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_MaintenanceIncidents_MaintenanceAssets_AssetId",
                        column: x => x.AssetId,
                        principalSchema: "StockManager",
                        principalTable: "MaintenanceAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceAssets_BinLocationId",
                schema: "StockManager",
                table: "MaintenanceAssets",
                column: "BinLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceIncidents_AssetId",
                schema: "StockManager",
                table: "MaintenanceIncidents",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceIncidents_AssignedToId",
                schema: "StockManager",
                table: "MaintenanceIncidents",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceIncidents_BinLocationId",
                schema: "StockManager",
                table: "MaintenanceIncidents",
                column: "BinLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceIncidents_ReportedById",
                schema: "StockManager",
                table: "MaintenanceIncidents",
                column: "ReportedById");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaintenanceIncidents",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "MaintenanceAssets",
                schema: "StockManager");
        }
    }
}
