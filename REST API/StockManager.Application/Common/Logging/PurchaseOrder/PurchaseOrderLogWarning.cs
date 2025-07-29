using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.PurchaseOrder;

namespace StockManager.Application.Common.Logging.PurchaseOrder;

public static class PurchaseOrderLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderNotFound,
            "Purchase order with id:{PurchaseOrderId} not found.");

    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogPurchaseOrderValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderValidationFailed,
            "Validation failed for purchase order: {ValidationErrors}");

    public static readonly Action<ILogger, string, Exception?> LogPurchaseOrderValidationFailedHandler =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderValidationFailedHandler,
            "Validation failed for purchase order: {ValidationErrors}");

    public static readonly Action<ILogger, object, Exception?> LogPurchaseOrderAlreadyExists =
        LoggerMessage.Define<object>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderAlreadyExists,
            "Purchase order already exists: {@purchaseOrder}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderAlreadyCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderAlreadyCancelled,
            "Purchase order with id:{PurchaseOrderId} is already cancelled.");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderAlreadyCompleted =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderAlreadyCompleted,
            "Purchase order with id:{PurchaseOrderId} is already completed.");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderAlreadyProcessing =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            PurchaseOrderLogEventIds.PurchaseOrderAlreadyProcessing,
            "Purchase order with id:{PurchaseOrderId} is already processing.");
}
