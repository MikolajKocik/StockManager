using System;

namespace StockManager.Application.Dtos.ModelsDto.Shipment;

public sealed record ShipmentUpdateDto
{
    public int Id { get; init; }
    public string? TrackingNumber { get; init; }
    public string? Status { get; init; }
    public DateTime? ShippedDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
}