using System;

namespace StockManager.Application.Dtos.ModelsDto.InventoryItem;

public sealed record InventoryItemCreateDto
{
    public int ProductId { get; init; }
    public int BinLocationId { get; init; }
    public string Warehouse { get; init; }
    public decimal QuantityOnHand { get; init; }
    public decimal QuantityReserved { get; init; }
}

