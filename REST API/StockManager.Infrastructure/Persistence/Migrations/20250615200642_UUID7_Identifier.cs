using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.Infrastructure.Migrations;

/// <inheritdoc />
public partial class UUID7_Identifier : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "ApplicationUser",
            table: "AspNetUsers");

        migrationBuilder.DropColumn(
            name: "Password",
            table: "AspNetUsers");

        migrationBuilder.AddColumn<string>(
            name: "Slug",
            table: "Suppliers",
            type: "nvarchar(max)",
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "Slug",
            table: "Products",
            type: "nvarchar(max)",
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "Slug",
            table: "Address",
            type: "nvarchar(max)",
            nullable: false,
            defaultValue: "");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "Slug",
            table: "Suppliers");

        migrationBuilder.DropColumn(
            name: "Slug",
            table: "Products");

        migrationBuilder.DropColumn(
            name: "Slug",
            table: "Address");

        migrationBuilder.AddColumn<string>(
            name: "ApplicationUser",
            table: "AspNetUsers",
            type: "nvarchar(max)",
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "Password",
            table: "AspNetUsers",
            type: "nvarchar(max)",
            nullable: false,
            defaultValue: "");
    }
}
