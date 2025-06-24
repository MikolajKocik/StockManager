using UUIDNext;

namespace StockManager.Models;

public sealed class Product
{
    public int Id { get; private set; } 
    public string Name { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
    public Genre Genre { get; private set; }
    public string Unit { get; private set; } = default!;
    public int Quantity {  get; private set; }
    public DateTime ExpirationDate { get; private set; }
    public DateTime DeliveredAt { get; private set; }
    public Warehouse Type { get; private set; }
    public string BatchNumber { get; private set; } = default!;

    // relation 1-* with supplier
    public Supplier Supplier { get; private set; } = default!;
    public Guid SupplierId { get; private set; }

    public Product(
        int id,
        string name,
        Genre genre,
        string unit,
        int quantity,
        Warehouse type,
        string batchNumber,
        Guid supplierId,
        DateTime expirationDate)
    {
        Id = id;
        Name = name;
        Slug = $"p_{Uuid.NewDatabaseFriendly(Database.SqlServer)}";
        Unit = unit;
        Quantity = quantity;
        Genre = genre;
        ExpirationDate = expirationDate;
        DeliveredAt = DateTime.UtcNow.Date;
        Type = type;
        BatchNumber = batchNumber;
        SupplierId = supplierId;
    }

    private Product() { }

    public void ChangeQuantity(int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero.");
        }

        Quantity = quantity;
    }

    public void SetSupplier(Supplier newSupplier)
    {
        Supplier = newSupplier ?? throw new ArgumentNullException(nameof(newSupplier));
    }

}
