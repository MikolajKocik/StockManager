using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Supplier;

namespace StockManager.Application.Dtos.ModelsDto.Product;

public sealed record ProductDto
{
    public int Id { get; }
    public string Name { get; }
    public string Slug { get; }
    public string Genre { get; }
    public string Unit { get; }
    public DateTime ExpirationDate { get; }
    public DateTime DeliveredAt { get; }
    public string Type { get; }
    public string BatchNumber { get; }
    public Guid SupplierId { get; }
    public string? SupplierName { get; } 
}
