using System;

namespace StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;

public sealed record SalesOrderCreateDto
{
    public int CustomerId { get; init; }
    public DateTime OrderDate { get; init; }
    public int InvoiceId { get; init; }
    public int? ReturnOrderId { get; init; }
    public DateTime? ShipDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
    public DateTime? CancelDate { get; init; }

}
