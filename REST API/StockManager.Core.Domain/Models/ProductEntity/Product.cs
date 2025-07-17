using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;
using StockManager.Core.Domain.Models.ReorderRuleEntity;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using UUIDNext;

namespace StockManager.Core.Domain.Models.ProductEntity;

public sealed partial class Product
{
    public int Id { get; private set; } 
    public string Name { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
    public Genre Genre { get; private set; }
    public string Unit { get; private set; } = default!;
    public DateTime ExpirationDate { get; private set; }
    public DateTime DeliveredAt { get; private set; }
    public Warehouse Type { get; private set; }
    public string BatchNumber { get; private set; } = default!;

    // relation *-1 with supplier
    public Supplier Supplier { get;  private set; } = default!;
    public Guid SupplierId { get; private set; }

    // relation 1-* with inventoryItem
    private readonly List<InventoryItem> _inventoryItems = new();
    public IReadOnlyCollection<InventoryItem> InventoryItems
        => _inventoryItems.AsReadOnly();

    // relation 1-* with purchaseOrderLine
    private readonly List<PurchaseOrderLine> _purchaseOrderLines = new();
    public IReadOnlyCollection<PurchaseOrderLine> PurchaseOrderLines
        => _purchaseOrderLines.AsReadOnly();

    // relation 1-* with salesOrderLine
    private readonly List<SalesOrderLine> _salesOrderLines = new();
    public IReadOnlyCollection<SalesOrderLine> SalesOrderLines
        => _salesOrderLines.AsReadOnly();

    // relation 1-* with returnOrderLine 
    private readonly List<ReturnOrderLine> _returnOrderLines = new();
    public IReadOnlyCollection<ReturnOrderLine> ReturnOrderLines
        => _returnOrderLines.AsReadOnly();

    // realtion 1-* with reorderRule
    private readonly List<ReorderRule> _reorderRules = new();
    public IReadOnlyCollection<ReorderRule> ReorderRules
        => _reorderRules.AsReadOnly();

    public Product(
        string name,
        Genre genre,
        string unit,
        Warehouse type,
        string batchNumber,
        Guid supplierId,
        DateTime expirationDate)
    {
        Name = name;
        Slug = $"p_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        Unit = unit;
        Genre = genre;
        ExpirationDate = expirationDate;
        DeliveredAt = DateTime.UtcNow.Date;
        Type = type;
        BatchNumber = batchNumber;
        SupplierId = supplierId;
    }

    private Product() { }
}
