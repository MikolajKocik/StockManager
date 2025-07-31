using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.Infrastructure.Migrations;

/// <inheritdoc />
public partial class RecoveryWithScheme : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_StockTransactions_InventoryItemId",
            schema: "StockManager",
            table: "StockTransactions");

        migrationBuilder.AlterColumn<Guid>(
            name: "AddressId",
            schema: "StockManager",
            table: "Suppliers",
            type: "uniqueidentifier",
            nullable: false,
            oldClrType: typeof(int),
            oldType: "int");

        migrationBuilder.AlterColumn<string>(
            name: "ReferenceNumber",
            schema: "StockManager",
            table: "StockTransactions",
            type: "nvarchar(100)",
            maxLength: 100,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "Date",
            schema: "StockManager",
            table: "StockTransactions",
            type: "date",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime2");

        migrationBuilder.AlterColumn<string>(
            name: "Type",
            schema: "StockManager",
            table: "Products",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(int),
            oldType: "int");

        migrationBuilder.AlterColumn<string>(
            name: "Genre",
            schema: "StockManager",
            table: "Products",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(int),
            oldType: "int");

        migrationBuilder.AddColumn<bool>(
            name: "IsDeleted",
            schema: "StockManager",
            table: "Products",
            type: "bit",
            nullable: true);

        migrationBuilder.CreateIndex(
            name: "UX_StockTransaction_BusinessKey",
            schema: "StockManager",
            table: "StockTransactions",
            columns: ["InventoryItemId", "Type", "Date", "ReferenceNumber", "SourceLocationId", "TargetLocationId"],
            unique: true,
            filter: "[SourceLocationId] IS NOT NULL AND [TargetLocationId] IS NOT NULL");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "UX_StockTransaction_BusinessKey",
            schema: "StockManager",
            table: "StockTransactions");

        migrationBuilder.DropColumn(
            name: "IsDeleted",
            schema: "StockManager",
            table: "Products");

        migrationBuilder.AlterColumn<int>(
            name: "AddressId",
            schema: "StockManager",
            table: "Suppliers",
            type: "int",
            nullable: false,
            oldClrType: typeof(Guid),
            oldType: "uniqueidentifier");

        migrationBuilder.AlterColumn<string>(
            name: "ReferenceNumber",
            schema: "StockManager",
            table: "StockTransactions",
            type: "nvarchar(max)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(100)",
            oldMaxLength: 100);

        migrationBuilder.AlterColumn<DateTime>(
            name: "Date",
            schema: "StockManager",
            table: "StockTransactions",
            type: "datetime2",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "date");

        migrationBuilder.AlterColumn<int>(
            name: "Type",
            schema: "StockManager",
            table: "Products",
            type: "int",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.AlterColumn<int>(
            name: "Genre",
            schema: "StockManager",
            table: "Products",
            type: "int",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "nvarchar(max)");

        migrationBuilder.CreateIndex(
            name: "IX_StockTransactions_InventoryItemId",
            schema: "StockManager",
            table: "StockTransactions",
            column: "InventoryItemId");
    }
}

