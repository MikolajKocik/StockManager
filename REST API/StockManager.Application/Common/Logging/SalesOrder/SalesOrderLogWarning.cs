using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.SalesOrder;

namespace StockManager.Application.Common.Logging.SalesOrder;

public static class SalesOrderLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogSalesOrderNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            SalesOrderLogEventIds.SalesOrderNotFound,
            "Sales order with id:{SalesOrderId} not found.");

    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogSalesOrderValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            SalesOrderLogEventIds.SalesOrderValidationFailed,
            "Validation failed for sales order: {ValidationErrors}");

    public static readonly Action<ILogger, string, Exception?> LogSalesOrderValidationFailedHandler =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            SalesOrderLogEventIds.SalesOrderValidationFailedHandler,
            "Validation failed for sales order: {ValidationErrors}");

    public static readonly Action<ILogger, object, Exception?> LogSalesOrderLineNotFound =
        LoggerMessage.Define<object>(
            LogLevel.Warning,
            SalesOrderLogEventIds.SalesOrderNotFound,
            "Sales order line not found for command: {@Command}");
}
