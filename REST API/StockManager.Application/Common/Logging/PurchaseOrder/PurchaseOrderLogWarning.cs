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
}
