using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
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

    public static readonly Action<ILogger, ShipmentCreateDto?, ShipmentUpdateDto?, Exception?> LogShipmentAlreadyExists =
        LoggerMessage.Define<ShipmentCreateDto?, ShipmentUpdateDto?>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentAlreadyExists,
            "Shipment already exists: {@shipment}{@shipment}");

    public static readonly Action<ILogger, int, Exception?> LogShipmentAlreadyDelivered =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentAlreadyDelivered,
            "Shipment with id:{ShipmentId} is already delivered.");

    public static readonly Action<ILogger, int, Exception?> LogShipmentAlreadyCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentAlreadyCancelled,
            "Shipment with id:{ShipmentId} is already cancelled.");

    public static readonly Action<ILogger, int, Exception?> LogShipmentAlreadyReturned =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentAlreadyReturned,
            "Shipment with id:{ShipmentId} is already returned.");

    public static readonly Action<ILogger, int, Exception?> LogShipmentAlreadyProcessing =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            ShipmentLogEventIds.ShipmentAlreadyProcessing,
            "Shipment with id:{ShipmentId} is already processing.");
}
