using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.SalesOrder;

namespace StockManager.Application.Common.Logging.SalesOrder;

public static class SalesOrderLogError
{
    public static readonly Action<ILogger, int, string, Exception?> LogSalesOrderCreateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            SalesOrderLogEventIds.SalesOrderCreateError,
            "Error creating sales order {SalesOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogSalesOrderUpdateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            SalesOrderLogEventIds.SalesOrderUpdateError,
            "Error updating sales order {SalesOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogSalesOrderDeleteError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            SalesOrderLogEventIds.SalesOrderDeleteError,
            "Error deleting sales order {SalesOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogSalesOrderCancelError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            SalesOrderLogEventIds.SalesOrderCancelError,
            "Error cancelling sales order {SalesOrderId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogSalesOrderCompleteError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            SalesOrderLogEventIds.SalesOrderCompleteError,
            "Error completing sales order {SalesOrderId}: {Error}");
}
