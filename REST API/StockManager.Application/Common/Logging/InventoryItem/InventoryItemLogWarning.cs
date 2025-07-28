using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.InventoryItem.InventoryItemCache;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.Common.Logging.InventoryItem;

public static class InventoryItemLogWarning
{
    public static readonly Action<ILogger, int, Exception?> LogInventoryItemNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            InventoryItemLogEventIds.InventoryItemNotFound,
            "Inventory item with id:{Id} not found");

    public static readonly Action<ILogger, int, Exception?> LogInventoryProductNotFound =
       LoggerMessage.Define<int>(
           LogLevel.Warning,
           InventoryItemLogEventIds.InventoryItemNotFound,
           "Inventory item with id:{Id} not found");

    public static readonly Action<ILogger, int, Exception?> LogInventoryBinLocationNotFound =
        LoggerMessage.Define<int>(
            LogLevel.Warning,
            InventoryItemLogEventIds.InventoryBinLocationNotFound,
            "Inventory item bin location with id:{Id} not found");


    public static readonly Action<ILogger, InventoryItemCreateDto, Exception?> LogInventoryItemValidationFailed =
        LoggerMessage.Define<InventoryItemCreateDto>(
            LogLevel.Warning,
            InventoryItemLogEventIds.InventoryItemValidationFailed,
            "Inventory item validation failed: {Error}");

    public static readonly Action<ILogger, InventoryItemUpdateDto, Exception?> LogInventoryItemUpdateValidationFailed =
        LoggerMessage.Define<InventoryItemUpdateDto>(
            LogLevel.Warning,
            InventoryItemLogEventIds.InventoryItemUpdateValidationFailed,
            "Inventory item update validation failed: {Error}");

    public static readonly Action<ILogger, string, Exception?> LogInventoryItemValidationFailedExtended =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            InventoryItemLogEventIds.InventoryItemValidationFailedExtended,
            "Inventory item validation failed (extended): {Error}");

    public static readonly Action<ILogger, string, Exception?> LogInventoryItemValidationQuantityOperationFailed =
        LoggerMessage.Define<string>(
            LogLevel.Warning,
            InventoryItemLogEventIds.InventoryItemValidationQuantityOperationFailed,
            "Inventory item validation for quantity operation failed: {Error}");
}
