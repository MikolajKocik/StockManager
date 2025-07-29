using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Common.Logging.EventIds.SalesOrder;

namespace StockManager.Application.Common.Logging.SalesOrder;

public static class SalesOrderLogInfo
{
    public static readonly Action<ILogger, object, Exception?> LogSalesOrderCreated =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderCreated,
            "Sales order created: {@salesOrder}");

    public static readonly Action<ILogger, object, Exception?> LogSalesOrderUpdated =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderUpdated,
            "Sales order updated: {@salesOrder}");

    public static readonly Action<ILogger, int, Exception?> LogSalesOrderDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderDeleted,
            "Sales order deleted: {SalesOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogSalesOrderCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderCancelled,
            "Sales order cancelled: {SalesOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogSalesOrderCompleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderCompleted,
            "Sales order completed: {SalesOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogSalesOrderDelivered =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderDelivered,
            "Sales order delivered: {SalesOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogSalesOrderReturned =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderReturned,
            "Sales order returned: {SalesOrderId}");

    public static readonly Action<ILogger, object, Exception?> LogSalesOrderLineAdded =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderUpdated,
            "Sales order line added: {@Line}");

    public static readonly Action<ILogger, int, Exception?> LogSalesOrderConfirmed =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderCompleted,
            "Sales order confirmed: {SalesOrderId}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogReturnedListOfSalesOrders =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            SalesOrderLogEventIds.ReturnedListOfSalesOrders,
            "Returned list of sales orders: {@salesOrders}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogSalesOrderFound =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            SalesOrderLogEventIds.SalesOrderFound,
            "Sales order found: {@salesOrder}");
}
