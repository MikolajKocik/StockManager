using System;

namespace StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
public sealed record ShipmentDto
{
    public int Id { get; init; }
    public int SalesOrderId { get; init; }
    public string? SalesOrderNumber { get; init; }
    public required string TrackingNumber { get; init; }
    public required string Status { get; init; }
    public DateTime ShippedDate { get; init; }
    public DateTime? DeliveredDate { get; init; }
    public string? CustomerName { get; init; }
    public string? DestinationCity { get; init; }
    public string? DestinationCountry { get; init; }
    public string? OriginCity { get; init; }
    public string? OriginCountry { get; init; }
}
