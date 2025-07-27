using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

public sealed record PurchaseOrderLineUpdateDto
{
    public int Id { get; init; }
    public decimal? Quantity { get; init; }
    public string? UoM { get; init; }
    public decimal? UnitPrice { get; init; }
}
