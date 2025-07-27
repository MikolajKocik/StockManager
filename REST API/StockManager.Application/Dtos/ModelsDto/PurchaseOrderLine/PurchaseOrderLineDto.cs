using System;

namespace StockManager.Application.Dtos.ModelsDto.PurchaseOrderLine;

public sealed record PurchaseOrderLineDto
{
    public int Id { get; }
    public int PurchaseOrderId { get; }
    public int ProductId { get; }
    public string? ProductName { get; }
    public decimal Quantity { get; }
    public string UoM { get; }
    public decimal UnitPrice { get; }
    public decimal LineTotal { get; }
}
