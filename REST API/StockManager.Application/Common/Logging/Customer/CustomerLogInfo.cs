using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Customer;

namespace StockManager.Application.Common.Logging.Customer;

public static class CustomerLogInfo
{
    public static readonly Action<ILogger, int, Exception?> LogCustomerCreated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            CustomerLogEventIds.CustomerCreated,
            "Customer created: {CustomerId}");

    public static readonly Action<ILogger, int, Exception?> LogCustomerUpdated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            CustomerLogEventIds.CustomerUpdated,
            "Customer updated: {CustomerId}");

    public static readonly Action<ILogger, int, Exception?> LogCustomerDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            CustomerLogEventIds.CustomerDeleted,
            "Customer deleted: {CustomerId}");
}
