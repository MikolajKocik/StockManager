using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Supplier;

namespace StockManager.Application.Dtos.ModelsDto.Product;


public sealed class ProductDto
{
    public int Id { get; set; }
    public required string Name { get; set; } 
    public required string Type { get; set; }
    public required string Genre { get; set; } 
    public required string Unit { get; set; }
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public DateTime DeliveredAt { get; set; }
    public required string BatchNumber { get; set; } 
    public SupplierDto? Supplier { get; set; }
    public Guid? SupplierId { get; set; }
}
