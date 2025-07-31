using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.PurchaseOrder;

namespace StockManager.Application.Common.Logging.PurchaseOrder;

public static class PurchaseOrderLogError
{
    public static readonly Action<ILogger, int, string, Exception?> LogPurchaseOrderCreateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            PurchaseOrderLogEventIds.PurchaseOrderCreateError,
            "Error creating purchase order {PurchaseOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogPurchaseOrderUpdateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            PurchaseOrderLogEventIds.PurchaseOrderUpdateError,
            "Error updating purchase order {PurchaseOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogPurchaseOrderDeleteError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            PurchaseOrderLogEventIds.PurchaseOrderDeleteError,
            "Error deleting purchase order {PurchaseOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogPurchaseOrderCancelError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            PurchaseOrderLogEventIds.PurchaseOrderCancelError,
            "Error cancelling purchase order {PurchaseOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogPurchaseOrderCompleteError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            PurchaseOrderLogEventIds.PurchaseOrderCompleteError,
            "Error completing purchase order {PurchaseOrderId}: {Error}");
}
