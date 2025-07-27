using System;

namespace StockManager.Application.Dtos.ModelsDto.ProductDtos;


public sealed record ProductCreateDto
{
    public string Name { get; init; }
    public string Genre { get; init; }
    public string Unit { get; init; }
    public string Type { get; init; }
    public string BatchNumber { get; init; }
    public Guid SupplierId { get; init; }
    public DateTime ExpirationDate { get; init; }
}

