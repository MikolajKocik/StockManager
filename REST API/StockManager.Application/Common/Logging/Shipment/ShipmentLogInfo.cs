using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Common.Logging.EventIds.Shipment;

namespace StockManager.Application.Common.Logging.Shipment;

public static class ShipmentLogInfo
{
    public static readonly Action<ILogger, int, Exception?> LogShipmentCreated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentCreated,
            "Shipment created: {ShipmentId}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentUpdated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentUpdated,
            "Shipment updated: {ShipmentId}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentDeleted,
            "Shipment deleted: {ShipmentId}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentCancelled,
            "Shipment cancelled: {ShipmentId}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentMarkedDelivered =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentMarkedDelivered,
            "Shipment marked as delivered: {ShipmentId}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentMarkedReturned =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentMarkedReturned,
            "Shipment marked as returned: {ShipmentId}");

    public static readonly Action<ILogger, Result<IEnumerable<ShipmentDto>>, Exception?> LogReturnedListOfShipments =
        LoggerMessage.Define<Result<IEnumerable<ShipmentDto>>>(
            LogLevel.Information,
            ShipmentLogEventIds.ReturnedListOfShipments,
            "Returned list of shipments: {@shipments}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentFound =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            ShipmentLogEventIds.ShipmentFound,
            "Shipment found: {ShipmentId}");
}
