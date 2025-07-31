using System;
using System.Collections.Generic;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Invoice;

namespace StockManager.Application.Common.Logging.Invoice;

public static class InvoiceLogWarning
{
    public static readonly Action<ILogger, int, Exception?> InvoiceNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            InvoiceLogEventIds.InvoiceNotFound,
            "Invoice with id:{InvoiceId} not found.");
}
