using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Customer;

namespace StockManager.Application.Common.Logging.Customer;

public static class CustomerLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogCustomerNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            CustomerLogEventIds.CustomerNotFound,
            "Customer with id:{CustomerId} not found.");

    public static readonly Action<ILogger, List<ValidationFailure>, Exception?> LogCustomerValidationFailed =
        LoggerMessage.Define<List<ValidationFailure>>(
            LogLevel.Warning,
            CustomerLogEventIds.CustomerValidationFailed,
            "Validation failed for customer: {ValidationErrors}");

    public static readonly Action<ILogger, string, Exception?> LogCustomerValidationFailedHandler =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            CustomerLogEventIds.CustomerValidationFailedHandler,
            "Validation failed for customer: {ValidationErrors}");

    public static readonly Action<ILogger, object, Exception?> LogCustomerAlreadyExists =
        LoggerMessage.Define<object>(
            LogLevel.Warning,
            CustomerLogEventIds.CustomerAlreadyExists,
            "Customer already exists: {@customer}");
}
