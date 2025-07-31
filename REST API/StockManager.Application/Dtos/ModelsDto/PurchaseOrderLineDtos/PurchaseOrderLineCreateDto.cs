using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

public sealed record PurchaseOrderLineCreateDto
{
    public int PurchaseOrderId { get; init; }
    public int ProductId { get; init; }
    public decimal Quantity { get; init; }
    public string UoM { get; init; }
    public decimal UnitPrice { get; init; }
}
