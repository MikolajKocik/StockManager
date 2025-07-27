using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderLine;

public sealed record SalesOrderLineDto
{
    public int Id { get; }
    public int SalesOrderId { get; }
    public int ProductId { get; }
    public string? ProductName { get; }
    public decimal Quantity { get; }
    public string UoM { get; }
    public decimal UnitPrice { get; }
    public decimal LineTotal { get; }
}
