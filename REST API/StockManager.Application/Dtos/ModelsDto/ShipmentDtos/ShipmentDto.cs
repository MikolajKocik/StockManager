using System;

namespace StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
public sealed record ShipmentDto
{
    public int Id { get; }
    public int SalesOrderId { get; }
    public string? SalesOrderNumber { get; }
    public string TrackingNumber { get; }
    public string Status { get; }
    public DateTime ShippedDate { get; }
    public DateTime? DeliveredDate { get; }
}
