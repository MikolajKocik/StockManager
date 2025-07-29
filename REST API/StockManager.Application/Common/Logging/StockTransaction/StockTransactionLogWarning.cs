using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.StockTransaction;

namespace StockManager.Application.Common.Logging.StockTransaction;

public static class StockTransactionLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogStockTransactionNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            StockTransactionLogEventIds.StockTransactionNotFound,
            "Stock transaction with id:{StockTransactionId} not found.");

    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogStockTransactionValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            StockTransactionLogEventIds.StockTransactionValidationFailed,
            "Validation failed for stock transaction: {ValidationErrors}");

    public static readonly Action<ILogger, string, Exception?> LogStockTransactionValidationFailedHandler =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            StockTransactionLogEventIds.StockTransactionValidationFailedHandler,
            "Validation failed for stock transaction: {ValidationErrors}");
}
