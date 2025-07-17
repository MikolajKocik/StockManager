using StockManager.Core.Domain.Models.AddressEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using UUIDNext;

namespace StockManager.Core.Domain.Models.SupplierEntity;

public sealed partial class Supplier
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!;
    public string Slug { get; private set; } = default!;

    // relation 1-1 with address
    public Address Address { get; private set; } = default!;

    // relation 1-* with product
    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products
        => _products.AsReadOnly();

    private Supplier() { }

    public Supplier(string name, Address address)
    {
        Name = name;
        Slug = $"s_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        Address = address;
    }
}
