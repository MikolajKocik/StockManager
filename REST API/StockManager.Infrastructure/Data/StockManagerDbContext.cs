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

namespace StockManager.Infrastructure.Data;

public sealed class StockManagerDbContext(DbContextOptions<StockManagerDbContext> options) 
    : IdentityDbContext<User>(options)
{

    internal DbSet<Product> Products { get; set; }
    internal DbSet<Supplier> Suppliers { get; set; }
    internal DbSet<Address> Adresses { get; set; }
    internal DbSet<InventoryItem> InventoryItems { get; set; }
    internal DbSet<StockTransaction> StockTransactions { get; set; }
    internal DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    internal DbSet<PurchaseOrderLine> PurchaseOrderLines { get; set; }
    internal DbSet<SalesOrder> SalesOrders { get; set; }
    internal DbSet<SalesOrderLine> SalesOrderLines { get; set; }
    internal DbSet<Customer> Customers { get; set; }
    internal DbSet<BinLocation> BinLocations { get; set; }
    internal DbSet<ReorderRule> ReorderRules { get; set; }
    internal DbSet<Shipment> Shipments { get; set; }
    internal DbSet<Invoice> Invoices { get; set; }
    internal DbSet<ReturnOrder> ReturnOrders { get; set; }
    internal DbSet<ReturnOrderLine> ReturnOrderLines { get; set; }
    internal DbSet<Role> DomainRoles { get; set; }
    internal DbSet<Permission> Permissions { get; set; }
    internal DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.HasDefaultSchema("StockManager");

        builder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}
