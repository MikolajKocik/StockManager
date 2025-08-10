using System;

namespace StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

public sealed record StockTransactionCreateDto
{
    public int InventoryItemId { get; init; }
    public required string Type { get; init; }
    public decimal Quantity { get; init; }
    public DateTime Date { get; init; }
    public required string ReferenceNumber { get; init; }
    public int? SourceLocationId { get; init; }
    public int? TargetLocationId { get; init; }
}
