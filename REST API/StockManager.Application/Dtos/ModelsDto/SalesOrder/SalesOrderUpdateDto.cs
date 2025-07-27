using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrder;

public sealed record SalesOrderUpdateDto
{
    public int Id { get; init; }
    public int? CustomerId { get; init; }
    public DateTime? OrderDate { get; init; }
    public int? InvoiceId { get; init; }
    public int? ReturnOrderId { get; init; }
    public DateTime? ShipDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
    public DateTime? CancelDate { get; init; }
    public string? Status { get; init; }
}
