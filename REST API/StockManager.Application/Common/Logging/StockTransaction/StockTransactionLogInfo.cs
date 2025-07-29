using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Common.Logging.EventIds.StockTransaction;

namespace StockManager.Application.Common.Logging.StockTransaction;

public static class StockTransactionLogInfo
{
    public static readonly Action<ILogger, object, Exception?> LogStockTransactionCreated =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionCreated,
            "Stock transaction created: {@stockTransaction}");

    public static readonly Action<ILogger, object, Exception?> LogStockTransactionUpdated =
        LoggerMessage.Define<object>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionUpdated,
            "Stock transaction updated: {@stockTransaction}");

    public static readonly Action<ILogger, int, Exception?> LogStockTransactionDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionDeleted,
            "Stock transaction deleted: {StockTransactionId}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogReturnedListOfStockTransactions =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            StockTransactionLogEventIds.ReturnedListOfStockTransactions,
            "Returned list of stock transactions: {@stockTransactions}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogStockTransactionFound =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionFound,
            "Stock transaction found: {@stockTransaction}");

    // Domenowe operacje
    public static readonly Action<ILogger, int, Exception?> LogStockTransactionReserved =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionReserved,
            "Stock transaction reserved: {StockTransactionId}");

    public static readonly Action<ILogger, int, Exception?> LogStockTransactionReleased =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionReleased,
            "Stock transaction released: {StockTransactionId}");

    public static readonly Action<ILogger, int, Exception?> LogStockTransactionConfirmed =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionConfirmed,
            "Stock transaction confirmed: {StockTransactionId}");

    public static readonly Action<ILogger, int, Exception?> LogStockTransactionCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionCancelled,
            "Stock transaction cancelled: {StockTransactionId}");

    public static readonly Action<ILogger, int, Exception?> LogStockTransactionAdjusted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            StockTransactionLogEventIds.StockTransactionAdjusted,
            "Stock transaction adjusted: {StockTransactionId}");
}
