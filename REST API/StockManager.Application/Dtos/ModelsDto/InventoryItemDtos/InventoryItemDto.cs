using System;

namespace StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

public sealed record InventoryItemDto
{
    public int Id { get; }
    public int ProductId { get; }
    public string? ProductName { get; }
    public int BinLocationId { get; }
    public string? BinLocationCode { get; }
    public string Warehouse { get; }
    public decimal QuantityOnHand { get; }
    public decimal QuantityReserved { get; }
    public decimal QuantityAvailable { get; }
}

