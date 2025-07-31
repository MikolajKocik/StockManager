using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;

public sealed record ReturnOrderLineDto
{
    public int Id { get; init; }
    public int ReturnOrderId { get; init; }
    public int ProductId { get; init; }
    public string? ProductName { get; init; }
    public decimal Quantity { get; init; }
    public string UoM { get; init; }
}

