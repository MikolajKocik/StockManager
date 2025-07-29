using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Shipment;

namespace StockManager.Application.Common.Logging.Shipment;

public static class ShipmentLogError
{
    public static readonly Action<ILogger, int, string, Exception?> LogShipmentCreateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            ShipmentLogEventIds.ShipmentCreateError,
            "Error creating shipment {ShipmentId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogShipmentUpdateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            ShipmentLogEventIds.ShipmentUpdateError,
            "Error updating shipment {ShipmentId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogShipmentDeleteError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            ShipmentLogEventIds.ShipmentDeleteError,
            "Error deleting shipment {ShipmentId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogShipmentCancelError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            ShipmentLogEventIds.ShipmentCancelError,
            "Error cancelling shipment {ShipmentId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogShipmentMarkDeliveredError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            ShipmentLogEventIds.ShipmentMarkDeliveredError,
            "Error marking shipment as delivered {ShipmentId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogShipmentMarkReturnedError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            ShipmentLogEventIds.ShipmentMarkReturnedError,
            "Error marking shipment as returned {ShipmentId}: {Error}");
}
