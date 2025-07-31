using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using System;

namespace StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipments;

public sealed record GetShipmentsQuery(
    int? SalesOrderId = null,
    string? TrackingNumber = null,
    string? Status = null,
    DateTime? ShippedDate = null,
    DateTime? DeliveredDate = null,
    int PageNumber = 1,
    int PageSize = 10
) : IQuery<IEnumerable<ShipmentDto>>;
