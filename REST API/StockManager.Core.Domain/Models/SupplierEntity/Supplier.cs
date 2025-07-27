using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;
using UUIDNext;

namespace StockManager.Core.Domain.Models.SupplierEntity;

public sealed partial class Supplier : Entity<Guid>
{
    public string Name { get; private set; } 
    public string Slug { get; private set; } 

    // relation 1-1 with address
    public Guid AddressId { get; private set; }
    public Address Address { get; private set; } 

    // relation 1-* with product
    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products
        => _products.AsReadOnly();

    // realtion 1-* with purchaseOrderLines
    private readonly List<PurchaseOrder> _purchaseOrders = new();
    public IReadOnlyCollection<PurchaseOrder> PurchaseOrders
        => _purchaseOrders.AsReadOnly();

    private Supplier() : base() { }

    public Supplier(
        string name,
        Guid addressId
        ) : base()
    {
        Guard.AgainstNullOrWhiteSpace(name);
        Guard.AgainstDefaultValue(addressId);

        Name = name;
        Slug = $"s_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        AddressId = addressId;
    }

    public Supplier(
        Guid id,
        string name,
        Guid addressId
        ) : base(id)
    {
        Guard.AgainstNullOrWhiteSpace(name);
        Guard.AgainstDefaultValue(addressId);

        Name = name;
        Slug = $"s_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        AddressId = addressId;
    }
}
