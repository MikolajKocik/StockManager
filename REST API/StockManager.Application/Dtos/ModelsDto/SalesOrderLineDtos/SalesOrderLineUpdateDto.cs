using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderLineDtos;

public sealed record SalesOrderLineUpdateDto
{
    public int Id { get; init; }
    public decimal? Quantity { get; init; }
    public string? UoM { get; init; }
    public decimal? UnitPrice { get; init; }
}
