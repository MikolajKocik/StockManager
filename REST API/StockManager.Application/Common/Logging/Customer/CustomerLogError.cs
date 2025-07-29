using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Customer;

namespace StockManager.Application.Common.Logging.Customer;

public static class CustomerLogError
{
    public static readonly Action<ILogger, string, Exception?> LogCustomerCreateError =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            CustomerLogEventIds.CustomerCreateError,
            "Error while creating customer: {Error}");

    public static readonly Action<ILogger, string, Exception?> LogCustomerUpdateError =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            CustomerLogEventIds.CustomerUpdateError,
            "Error while updating customer: {Error}");

    public static readonly Action<ILogger, string, Exception?> LogCustomerDeleteError =
        LoggerMessage.Define<string>(
            LogLevel.Error,
            CustomerLogEventIds.CustomerDeleteError,
            "Error while deleting customer: {Error}");
}
