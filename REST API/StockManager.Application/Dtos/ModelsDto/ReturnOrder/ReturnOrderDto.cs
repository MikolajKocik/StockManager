using System;

namespace StockManager.Application.Dtos.ModelsDto.ReturnOrder;

public sealed record ReturnOrderDto
{
    public int Id { get; }
    public string Type { get; }
    public string Status { get; }
    public DateTime ReturnDate { get; }
    public int? PurchaseOrderId { get; }
    public int? SalesOrderId { get; }
}