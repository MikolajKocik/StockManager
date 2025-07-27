using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrderLine;

public sealed record ReturnOrderLineDto
{
    public int Id { get; }
    public int ReturnOrderId { get; }
    public int ProductId { get; }
    public string? ProductName { get; }
    public decimal Quantity { get; }
    public string UoM { get; }
}