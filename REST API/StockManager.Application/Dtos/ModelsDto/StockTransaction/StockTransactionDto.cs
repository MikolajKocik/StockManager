using System;

namespace StockManager.Application.Dtos.ModelsDto.StockTransaction;

public sealed record StockTransactionDto
{
    public int Id { get; }
    public int InventoryItemId { get; }
    public string? InventoryItemName { get; }
    public string Type { get; }
    public decimal Quantity { get; }
    public DateTime Date { get; }
    public string ReferenceNumber { get; }
    public int? SourceLocationId { get; }
    public int? TargetLocationId { get; }
}
