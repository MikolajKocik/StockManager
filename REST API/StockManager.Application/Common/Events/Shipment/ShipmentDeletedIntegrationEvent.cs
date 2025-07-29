namespace StockManager.Application.Common.Events.Shipment;

public sealed record ShipmentDeletedIntegrationEvent(int ShipmentId) : IIntegrationEvent;
