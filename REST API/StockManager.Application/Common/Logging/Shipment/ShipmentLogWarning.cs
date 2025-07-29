using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Shipment;

namespace StockManager.Application.Common.Logging.Shipment;

public static class ShipmentLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogShipmentNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentNotFound,
            "Shipment with id:{ShipmentId} not found.");

    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogShipmentValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentValidationFailed,
            "Validation failed for shipment: {ValidationErrors}");

    public static readonly Action<ILogger, string, Exception?> LogShipmentValidationFailedHandler =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentValidationFailedHandler,
            "Validation failed for shipment: {ValidationErrors}");
}
