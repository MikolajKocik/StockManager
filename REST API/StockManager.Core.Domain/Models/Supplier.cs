using UUIDNext;

namespace StockManager.Models;

public sealed class Supplier
{
    public Guid Id { get; private set; }
    public string Name { get; set; } = default!;
    public string Slug { get; private set; } = default!;

    // relation 1-1 with supplier
    public Address Address { get; set; } = default!;

    // relation 1-* with product
    public List<Product> Products { get; private set; } = new List<Product>();

    private Supplier() { }

    public Supplier(Guid id, string name, Address address)
    {
        Id = id;
        Name = name;
        Slug = $"s_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        Address = address;
    }
}
