using System;

namespace StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

public sealed record InventoryItemDto
{
    public int Id { get; init; }
    public int ProductId { get; init; }
    public string? ProductName { get; init; }
    public int BinLocationId { get; init; }
    public string? BinLocationCode { get; init; }
    public required string Warehouse { get; init; }
    public decimal QuantityOnHand { get; init; }
    public decimal QuantityReserved { get; init; }
    public decimal QuantityAvailable { get; init; }
}

