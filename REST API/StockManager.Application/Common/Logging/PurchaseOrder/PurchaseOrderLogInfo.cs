using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Common.Logging.EventIds.PurchaseOrder;

namespace StockManager.Application.Common.Logging.PurchaseOrder;

public static class PurchaseOrderLogInfo
{
    public static readonly Action<ILogger, object, Exception?> LogPurchaseOrderCreated =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCreated,
            "Purchase order created: {@purchaseOrder}");

    public static readonly Action<ILogger, object, Exception?> LogPurchaseOrderUpdated =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderUpdated,
            "Purchase order updated: {@purchaseOrder}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderDeleted,
            "Purchase order deleted: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCancelled,
            "Purchase order cancelled: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderCompleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCompleted,
            "Purchase order completed: {PurchaseOrderId}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogReturnedListOfPurchaseOrders =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.ReturnedListOfPurchaseOrders,
            "Returned list of purchase orders: {@purchaseOrders}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogPurchaseOrderFound =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderFound,
            "Purchase order found: {@purchaseOrder}");
}
