using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class newModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Products");

            migrationBuilder.EnsureSchema(
                name: "StockManager");

            migrationBuilder.RenameTable(
                name: "Suppliers",
                newName: "Suppliers",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Products",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetUserTokens",
                newName: "AspNetUserTokens",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                newName: "AspNetUsers",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetUserRoles",
                newName: "AspNetUserRoles",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetUserLogins",
                newName: "AspNetUserLogins",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetUserClaims",
                newName: "AspNetUserClaims",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetRoles",
                newName: "AspNetRoles",
                newSchema: "StockManager");

            migrationBuilder.RenameTable(
                name: "AspNetRoleClaims",
                newName: "AspNetRoleClaims",
                newSchema: "StockManager");

            migrationBuilder.AddColumn<int>(
                name: "AddressId",
                schema: "StockManager",
                table: "Suppliers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "StockManager",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                schema: "StockManager",
                table: "AspNetUsers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Adresses",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupplierId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Address_Supplier",
                        column: x => x.SupplierId,
                        principalSchema: "StockManager",
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EntityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Changes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChangedById = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChangedBy_User_AuditLog",
                        column: x => x.ChangedById,
                        principalSchema: "StockManager",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BinLocations",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Warehouse = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BinLocations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DomainRoles",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DomainRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReorderRules",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Warehouse = table.Column<int>(type: "int", nullable: false),
                    MinLevel = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxLevel = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReorderRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_ReorderRules",
                        column: x => x.ProductId,
                        principalSchema: "StockManager",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReturnOrders",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SalesOrderId = table.Column<int>(type: "int", nullable: true),
                    PurchaseOrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReturnOrders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TaxId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AddressId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Address_Customer",
                        column: x => x.AddressId,
                        principalSchema: "StockManager",
                        principalTable: "Adresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InventoryItems",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Warehouse = table.Column<int>(type: "int", nullable: false),
                    QuantityOnHand = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    QuantityReserved = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    BinLocationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvetoryItem_BinLocation",
                        column: x => x.BinLocationId,
                        principalSchema: "StockManager",
                        principalTable: "BinLocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Product_InventoryItem",
                        column: x => x.ProductId,
                        principalSchema: "StockManager",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                schema: "StockManager",
                columns: table => new
                {
                    PermissionId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.PermissionId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_RolePermissions_DomainRoles_PermissionId",
                        column: x => x.PermissionId,
                        principalSchema: "StockManager",
                        principalTable: "DomainRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "StockManager",
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrders",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpectedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SupplierId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InvoiceId = table.Column<int>(type: "int", nullable: true),
                    ReturnOrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PurchaseOrder_Supplier",
                        column: x => x.SupplierId,
                        principalSchema: "StockManager",
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReturnOrder_PurchaseOrder",
                        column: x => x.ReturnOrderId,
                        principalSchema: "StockManager",
                        principalTable: "ReturnOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReturnOrderLines",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReturnOrderId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UoM = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReturnOrderLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_ReturnOrderLine",
                        column: x => x.ProductId,
                        principalSchema: "StockManager",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReturnOrder_ReturnOrderLine",
                        column: x => x.ReturnOrderId,
                        principalSchema: "StockManager",
                        principalTable: "ReturnOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SalesOrders",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ShipDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeliveredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancelDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    InvoiceId = table.Column<int>(type: "int", nullable: false),
                    ReturnOrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReturnOrder_SalesOrder",
                        column: x => x.ReturnOrderId,
                        principalSchema: "StockManager",
                        principalTable: "ReturnOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SalesOrder_Customer",
                        column: x => x.CustomerId,
                        principalSchema: "StockManager",
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StockTransactions",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SourceLocationId = table.Column<int>(type: "int", nullable: true),
                    TargetLocationId = table.Column<int>(type: "int", nullable: true),
                    ReferenceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InventoryItemId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryItem_StockTransaction",
                        column: x => x.InventoryItemId,
                        principalSchema: "StockManager",
                        principalTable: "InventoryItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PurchaseOrderLines",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UoM = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    PurchaseOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PurchaseOrderLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_PurchaseOrderLine",
                        column: x => x.ProductId,
                        principalSchema: "StockManager",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PurchaseOrder_PurchaseOrderLine",
                        column: x => x.PurchaseOrderId,
                        principalSchema: "StockManager",
                        principalTable: "PurchaseOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PurchaseOrderId = table.Column<int>(type: "int", nullable: true),
                    SalesOrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PurchaseOrder_Invoice",
                        column: x => x.PurchaseOrderId,
                        principalSchema: "StockManager",
                        principalTable: "PurchaseOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SalesOrder_Invoice",
                        column: x => x.SalesOrderId,
                        principalSchema: "StockManager",
                        principalTable: "SalesOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SalesOrderLines",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UoM = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    SalesOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesOrderLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_SalesOrderLine",
                        column: x => x.ProductId,
                        principalSchema: "StockManager",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SalesOrder_SalesOrderLine",
                        column: x => x.SalesOrderId,
                        principalSchema: "StockManager",
                        principalTable: "SalesOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Shipments",
                schema: "StockManager",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrackingNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ShippedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SalesOrderId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SalesOrder_Shipment",
                        column: x => x.SalesOrderId,
                        principalSchema: "StockManager",
                        principalTable: "SalesOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_Slug",
                schema: "StockManager",
                table: "Products",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_Slug",
                schema: "StockManager",
                table: "AspNetUsers",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Adresses_SupplierId",
                schema: "StockManager",
                table: "Adresses",
                column: "SupplierId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_ChangedById",
                schema: "StockManager",
                table: "AuditLogs",
                column: "ChangedById");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_AddressId",
                schema: "StockManager",
                table: "Customers",
                column: "AddressId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_BinLocationId",
                schema: "StockManager",
                table: "InventoryItems",
                column: "BinLocationId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryItems_ProductId",
                schema: "StockManager",
                table: "InventoryItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_PurchaseOrderId",
                schema: "StockManager",
                table: "Invoices",
                column: "PurchaseOrderId",
                unique: true,
                filter: "[PurchaseOrderId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_SalesOrderId",
                schema: "StockManager",
                table: "Invoices",
                column: "SalesOrderId",
                unique: true,
                filter: "[SalesOrderId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderLines_ProductId",
                schema: "StockManager",
                table: "PurchaseOrderLines",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrderLines_PurchaseOrderId",
                schema: "StockManager",
                table: "PurchaseOrderLines",
                column: "PurchaseOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_ReturnOrderId",
                schema: "StockManager",
                table: "PurchaseOrders",
                column: "ReturnOrderId",
                unique: true,
                filter: "[ReturnOrderId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_SupplierId",
                schema: "StockManager",
                table: "PurchaseOrders",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_ReorderRules_ProductId",
                schema: "StockManager",
                table: "ReorderRules",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnOrderLines_ProductId",
                schema: "StockManager",
                table: "ReturnOrderLines",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnOrderLines_ReturnOrderId",
                schema: "StockManager",
                table: "ReturnOrderLines",
                column: "ReturnOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_RoleId",
                schema: "StockManager",
                table: "RolePermissions",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderLines_ProductId",
                schema: "StockManager",
                table: "SalesOrderLines",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrderLines_SalesOrderId",
                schema: "StockManager",
                table: "SalesOrderLines",
                column: "SalesOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrders_CustomerId",
                schema: "StockManager",
                table: "SalesOrders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesOrders_ReturnOrderId",
                schema: "StockManager",
                table: "SalesOrders",
                column: "ReturnOrderId",
                unique: true,
                filter: "[ReturnOrderId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Shipments_SalesOrderId",
                schema: "StockManager",
                table: "Shipments",
                column: "SalesOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_InventoryItemId",
                schema: "StockManager",
                table: "StockTransactions",
                column: "InventoryItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "Invoices",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "PurchaseOrderLines",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "ReorderRules",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "ReturnOrderLines",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "RolePermissions",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "SalesOrderLines",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "Shipments",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "StockTransactions",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "PurchaseOrders",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "DomainRoles",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "Permissions",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "SalesOrders",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "InventoryItems",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "ReturnOrders",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "Customers",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "BinLocations",
                schema: "StockManager");

            migrationBuilder.DropTable(
                name: "Adresses",
                schema: "StockManager");

            migrationBuilder.DropIndex(
                name: "IX_Products_Slug",
                schema: "StockManager",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_Slug",
                schema: "StockManager",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AddressId",
                schema: "StockManager",
                table: "Suppliers");

            migrationBuilder.RenameTable(
                name: "Suppliers",
                schema: "StockManager",
                newName: "Suppliers");

            migrationBuilder.RenameTable(
                name: "Products",
                schema: "StockManager",
                newName: "Products");

            migrationBuilder.RenameTable(
                name: "AspNetUserTokens",
                schema: "StockManager",
                newName: "AspNetUserTokens");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                schema: "StockManager",
                newName: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "AspNetUserRoles",
                schema: "StockManager",
                newName: "AspNetUserRoles");

            migrationBuilder.RenameTable(
                name: "AspNetUserLogins",
                schema: "StockManager",
                newName: "AspNetUserLogins");

            migrationBuilder.RenameTable(
                name: "AspNetUserClaims",
                schema: "StockManager",
                newName: "AspNetUserClaims");

            migrationBuilder.RenameTable(
                name: "AspNetRoles",
                schema: "StockManager",
                newName: "AspNetRoles");

            migrationBuilder.RenameTable(
                name: "AspNetRoleClaims",
                schema: "StockManager",
                newName: "AspNetRoleClaims");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateTable(
                name: "Address",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SupplierId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Address", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Address_Supplier",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Address_SupplierId",
                table: "Address",
                column: "SupplierId",
                unique: true);
        }
    }
}
