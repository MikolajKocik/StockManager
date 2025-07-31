using System;

namespace StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
public sealed record ShipmentDto
{
    public int Id { get; init; }
    public int SalesOrderId { get; init; }
    public string? SalesOrderNumber { get; init; }
    public string TrackingNumber { get; init; }
    public string Status { get; init; }
    public DateTime ShippedDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
}
