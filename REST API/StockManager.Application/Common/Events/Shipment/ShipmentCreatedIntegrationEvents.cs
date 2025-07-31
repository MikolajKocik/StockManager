using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Common.Events;

namespace StockManager.Application.Common.Events.Shipment;

public sealed record ShipmentCreatedIntegrationEvent(ShipmentDto Shipment) : IIntegrationEvent;
