using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

public sealed record SalesOrderDto
{
    public int Id { get; }
    public int CustomerId { get; }
    public string? CustomerName { get; }
    public DateTime OrderDate { get; }
    public DateTime? ShipDate { get; }
    public DateTime? DeliveredDate { get; }
    public DateTime? CancelDate { get; }
    public string Status { get; }
    public int InvoiceId { get; }
    public int? ReturnOrderId { get; }
}
