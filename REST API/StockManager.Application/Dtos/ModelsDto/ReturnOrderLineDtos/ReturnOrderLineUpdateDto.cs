using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrderLineDtos;

public sealed record ReturnOrderLineUpdateDto
{
    public int Id { get; init; }
    public decimal? Quantity { get; init; }
    public string? UoM { get; init; }
}
