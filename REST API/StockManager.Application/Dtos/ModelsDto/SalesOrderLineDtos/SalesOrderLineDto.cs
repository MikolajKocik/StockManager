using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderLineDtos;

public sealed record SalesOrderLineDto
{
    public int Id { get; init; }
    public int SalesOrderId { get; init; }
    public int ProductId { get; init; }
    public string? ProductName { get; init; }
    public decimal Quantity { get; init; }
    public string UoM { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal LineTotal { get; init; }
}
