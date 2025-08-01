using System;

namespace StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

public sealed record ShipmentCreateDto
{
    public int SalesOrderId { get; init; }
    public string TrackingNumber { get; init; }
    public string Status { get; init; }
    public DateTime ShippedDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
}
