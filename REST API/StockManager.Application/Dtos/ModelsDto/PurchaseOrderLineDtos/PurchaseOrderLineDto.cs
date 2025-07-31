using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

public sealed record PurchaseOrderLineDto
{
    public int Id { get; init; }
    public int PurchaseOrderId { get; init; }
    public int ProductId { get; init; }
    public string? ProductName { get; init; }
    public decimal Quantity { get; init; }
    public string UoM { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal LineTotal { get; init; }
}
