using System;

namespace StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

public sealed record InventoryItemCreateDto
{
    public int ProductId { get; init; }
    public int BinLocationId { get; init; }
    public required string Warehouse { get; init; }
    public decimal QuantityOnHand { get; init; }
    public decimal QuantityReserved { get; init; }
}

