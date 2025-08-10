using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;

public sealed record ReturnOrderLineCreateDto
{
    public int ReturnOrderId { get; init; }
    public int ProductId { get; init; }
    public decimal Quantity { get; init; }
    public required string UoM { get; init; }
}
