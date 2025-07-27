using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrderLine;

public sealed record ReturnOrderLineCreateDto
{
    public int ReturnOrderId { get; init; }
    public int ProductId { get; init; }
    public decimal Quantity { get; init; }
    public string UoM { get; init; }
}