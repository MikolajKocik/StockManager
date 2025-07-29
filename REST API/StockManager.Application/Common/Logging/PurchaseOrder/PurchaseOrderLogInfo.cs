using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Common.Logging.EventIds.PurchaseOrder;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;

namespace StockManager.Application.Common.Logging.PurchaseOrder;

public static class PurchaseOrderLogInfo
{
    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderCreated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCreated,
            "Purchase order created: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderUpdated =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderUpdated,
            "Purchase order updated: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderDeleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderDeleted,
            "Purchase order deleted: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderCancelled =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCancelled,
            "Purchase order cancelled: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderCompleted =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCompleted,
            "Purchase order completed: {PurchaseOrderId}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderConfirmed =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderCompleted,
            "Purchase order confirmed: {PurchaseOrderId}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogReturnedListOfPurchaseOrders =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.ReturnedListOfPurchaseOrders,
            "Returned list of purchase orders: {@purchaseOrders}");

    public static readonly Action<ILogger, Result<IEnumerable<object>>, Exception?> LogPurchaseOrderFound =
        LoggerMessage.Define<Result<IEnumerable<object>>>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderFound,
            "Purchase order found: {@purchaseOrder}");

    public static readonly Action<ILogger, DateTime, Exception?> LogPurchaseOrderDateTimeSet =
        LoggerMessage.Define<DateTime>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderUpdated,
            "Purchase order expected date set: {ExpectedDate}");

    public static readonly Action<ILogger, int, Exception?> LogPurchaseOrderInvoiceAssigned =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderUpdated,
            "Purchase order invoice assigned: {InvoiceId}");

    public static readonly Action<ILogger, int, Exception?> PurchaseOrderReturned =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderUpdated,
            "Purchase order return assigned: {ReturnOrderId}");

    public static readonly Action<ILogger, PurchaseOrderLineCreateDto, int, Exception?> PurchasOrderLineAdded =
        LoggerMessage.Define<PurchaseOrderLineCreateDto, int>(
            LogLevel.Information,
            PurchaseOrderLogEventIds.PurchaseOrderUpdated,
            "Purchase order line added: {@Line} to PurchaseOrderId: {PurchaseOrderId}");
}
