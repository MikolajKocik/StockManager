using System;

namespace StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

public sealed record StockTransactionDto
{
    public int Id { get; init;  }
    public int InventoryItemId { get; init;  }
    public string? InventoryItemName { get; init; }
    public string Type { get; init; }
    public decimal Quantity { get; init; }
    public DateTime Date { get; init; }
    public string ReferenceNumber { get; init; }
    public int? SourceLocationId { get; init; }
    public int? TargetLocationId { get; init; }
}
