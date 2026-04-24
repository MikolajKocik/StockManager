using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.AuditLogEntity;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Models.PermissionEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;
using StockManager.Core.Domain.Models.ReorderRuleEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;
using StockManager.Core.Domain.Models.RoleEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;
using StockManager.Core.Domain.Models.ShipmentEntity;
using StockManager.Core.Domain.Models.StockTransactionEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Core.Domain.Models.UserEntity;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;


namespace StockManager.Infrastructure.Persistence.Data;

public sealed class StockManagerDbContext(DbContextOptions<StockManagerDbContext> options) 
    : IdentityDbContext<User>(options)
{

    public DbSet<Product> Products { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Address> Adresses { get; set; }
    public DbSet<InventoryItem> InventoryItems { get; set; }
    public DbSet<StockTransaction> StockTransactions { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderLine> PurchaseOrderLines { get; set; }
    public DbSet<SalesOrder> SalesOrders { get; set; }
    public DbSet<SalesOrderLine> SalesOrderLines { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<BinLocation> BinLocations { get; set; }
    public DbSet<ReorderRule> ReorderRules { get; set; }
    public DbSet<Shipment> Shipments { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<ReturnOrder> ReturnOrders { get; set; }
    public DbSet<ReturnOrderLine> ReturnOrderLines { get; set; }
    public DbSet<Role> DomainRoles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<WarehouseOperation> WarehouseOperations { get; set; }
    public DbSet<OperationItem> OperationItems { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<FileMetadata> FileMetadatas { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasDefaultSchema("StockManager");

        builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}
