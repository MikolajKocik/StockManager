using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.Dtos.ModelsDto.ProductDtos;

public sealed record ProductDto
{
    public int Id { get; init; }
    public bool? IsDeleted { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; } 
    public required string Genre { get; init; }
    public required string Unit { get; init; }
    public DateTime ExpirationDate { get; init; }
    public DateTime DeliveredAt { get; init; }
    public required string Type { get; init; }
    public required string BatchNumber { get; init; }
    public Guid SupplierId { get; init; }
    public string? SupplierName { get; init; } 
}
