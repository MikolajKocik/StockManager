using System;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Invoice;

namespace StockManager.Application.Common.Logging.Invoice;

public static class InvoiceLogInfo
{
    public static readonly Action<ILogger, int, Exception?> LogInvoiceCreated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoiceCreated,
            "Invoice created: {InvoiceId}");

    public static readonly Action<ILogger, int, Exception?> LogInvoiceUpdated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoiceUpdated,
            "Invoice updated: {InvoiceId}");

    public static readonly Action<ILogger, int, DateTime, Exception?> LogInvoicePayed =
        LoggerMessage.Define<int, DateTime>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoicePayed,
            "Invoice updated: {InvoiceId} at {UpdateDate}");

    public static readonly Action<ILogger, int, Exception?> LogInvoiceDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoiceDeleted,
            "Invoice deleted: {InvoiceId}");

    public static readonly Action<ILogger, int, Exception?> LogInvoiceCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoiceCancelled,
            "Invoice cancelled: {InvoiceId}");

    public static readonly Action<ILogger, int, Exception?> LogInvoiceCompleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoiceCompleted,
            "Invoice completed: {InvoiceId}");

    public static readonly Action<ILogger, int, DateTime, Exception?> LogInvoiceIssued =
        LoggerMessage.Define<int, DateTime>(
            LogLevel.Information,
            InvoiceLogEventIds.InvoiceIssued,
            "Invoice issued: {InvoiceId} at {IssueDate}");
}
