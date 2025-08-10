using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

public sealed record SalesOrderDto
{
    public int Id { get; init; }
    public int CustomerId { get; init; }
    public string? CustomerName { get; init; }
    public DateTime OrderDate { get; init; }
    public DateTime? ShipDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
    public DateTime? CancelDate { get; init; }
    public required string Status { get; init; }
    public int InvoiceId { get; init; }
    public int? ReturnOrderId { get; init; }
}
