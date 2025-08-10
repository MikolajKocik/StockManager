using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderLineDtos;

public sealed record SalesOrderLineCreateDto
{
    public int SalesOrderId { get; init; }
    public int ProductId { get; init; }
    public decimal Quantity { get; init; }
    public required string UoM { get; init; }
    public decimal UnitPrice { get; init; }
}
