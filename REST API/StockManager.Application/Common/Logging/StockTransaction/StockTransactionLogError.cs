using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.StockTransaction;

namespace StockManager.Application.Common.Logging.StockTransaction;

public static class StockTransactionLogError
{
    public static readonly Action<ILogger, int, string, Exception?> LogStockTransactionCreateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            StockTransactionLogEventIds.StockTransactionCreateError,
            "Error creating stock transaction {StockTransactionId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogStockTransactionUpdateError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            StockTransactionLogEventIds.StockTransactionUpdateError,
            "Error updating stock transaction {StockTransactionId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogStockTransactionDeleteError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            StockTransactionLogEventIds.StockTransactionDeleteError,
            "Error deleting stock transaction {StockTransactionId}: {Error}");

    public static readonly Action<ILogger, int, string, Exception?> LogStockTransactionDomainError =
        LoggerMessage.Define<int, string>(
            LogLevel.Error,
            StockTransactionLogEventIds.StockTransactionDomainError,
            "Domain error for stock transaction {StockTransactionId}: {Error}");
}
