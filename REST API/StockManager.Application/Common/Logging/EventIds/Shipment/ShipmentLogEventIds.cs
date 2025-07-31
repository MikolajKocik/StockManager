using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.Shipment;

public static class ShipmentLogEventIds
{
    public static readonly EventId ShipmentCreated = new(1000, nameof(ShipmentCreated));
    public static readonly EventId ShipmentUpdated = new(1001, nameof(ShipmentUpdated));
    public static readonly EventId ShipmentDeleted = new(1002, nameof(ShipmentDeleted));
    public static readonly EventId ShipmentCancelled = new(1003, nameof(ShipmentCancelled));
    public static readonly EventId ShipmentMarkedDelivered = new(1004, nameof(ShipmentMarkedDelivered));
    public static readonly EventId ShipmentMarkedReturned = new(1005, nameof(ShipmentMarkedReturned));
    public static readonly EventId ReturnedListOfShipments = new(1006, nameof(ReturnedListOfShipments));
    public static readonly EventId ShipmentFound = new(1007, nameof(ShipmentFound));

    public static readonly EventId ShipmentCreateError = new(2000, nameof(ShipmentCreateError));
    public static readonly EventId ShipmentUpdateError = new(2001, nameof(ShipmentUpdateError));
    public static readonly EventId ShipmentDeleteError = new(2002, nameof(ShipmentDeleteError));
    public static readonly EventId ShipmentCancelError = new(2003, nameof(ShipmentCancelError));
    public static readonly EventId ShipmentMarkDeliveredError = new(2004, nameof(ShipmentMarkDeliveredError));
    public static readonly EventId ShipmentMarkReturnedError = new(2005, nameof(ShipmentMarkReturnedError));

    public static readonly EventId ShipmentNotFound = new(3000, nameof(ShipmentNotFound));
    public static readonly EventId ShipmentValidationFailed = new(3001, nameof(ShipmentValidationFailed));
    public static readonly EventId ShipmentValidationFailedHandler = new(3002, nameof(ShipmentValidationFailedHandler));
    public static readonly EventId ShipmentAlreadyExists = new(3003, nameof(ShipmentAlreadyExists));
    public static readonly EventId ShipmentAlreadyDelivered = new(3004, nameof(ShipmentAlreadyDelivered));
    public static readonly EventId ShipmentAlreadyCancelled = new(3005, nameof(ShipmentAlreadyCancelled));
    public static readonly EventId ShipmentAlreadyReturned = new(3006, nameof(ShipmentAlreadyReturned));
    public static readonly EventId ShipmentAlreadyProcessing = new(3007, nameof(ShipmentAlreadyProcessing));
}
