using System;

namespace StockManager.Application.Dtos.ModelsDto.ProductDtos;


public sealed record ProductCreateDto
{
    public required string Name { get; init; }
    public required string Genre { get; init; }
    public required string Unit { get; init; }
    public required string Type { get; init; }
    public required string BatchNumber { get; init; }
    public Guid SupplierId { get; init; }
    public DateTime ExpirationDate { get; init; }
}

