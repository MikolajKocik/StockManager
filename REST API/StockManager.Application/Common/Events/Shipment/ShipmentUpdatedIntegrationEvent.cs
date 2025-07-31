using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;

namespace StockManager.Application.Common.Events.Shipment;

public sealed record ShipmentUpdatedIntegrationEvent(ShipmentDto Shipment) : IIntegrationEvent;
