using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.InventoryItem.InventoryItemCache;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.BinLocationDtos;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.Common.Logging.InventoryItem;
public static class InventoryItemLogInfo
{
    public static readonly Action<ILogger, int, int, string, Exception?> LogAddInventoryItemSuccesfull =
        LoggerMessage.Define<int, int, string>(
            LogLevel.Information,
            InventoryItemLogEventIds.AddInventoryItemSuccesfull,
            "A new inventory item id: {Id} and produt: {ProductId} with bin code: {BinLocationCode} added to database");

    public static readonly Action<ILogger, int, Exception?> LogRemovingInventoryItemOperation =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InventoryItemLogEventIds.RemovingInventoryItemOperation,
            "Removing the provided inventory item:{@inventoryItem}");

    public static readonly Action<ILogger, int, int?, int?, Exception?> LogModyfingInventoryItem =
        LoggerMessage.Define<int, int?, int?>(
            LogLevel.Information,
            InventoryItemLogEventIds.ModyfingInventoryItem,
            "Modifying the provided inventory item:{@inventoryItemId} with {@modifiedInventoryItem} and {@binLocationId}");

    public static readonly Action<ILogger, Result<IEnumerable<InventoryItemDto>>, Exception?> LogReturningListOfInventoryItemSuccessfull =
        LoggerMessage.Define<Result<IEnumerable<InventoryItemDto>>>(
            LogLevel.Information,
            InventoryItemLogEventIds.ReturningListOfInventoryItemSuccessfull,
            "Succesfully returns a list of inventory items: {InventoryItems}");

    public static readonly Action<ILogger, int, Exception?> LogInventoryItemFoundSuccess =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemFoundSuccess,
            "Succesfully found the inventory item with id:{Id}");

    public static readonly Action<ILogger, int, Exception?> LogInventoryItemModifiedSuccess =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemModifiedSuccess,
            "Inventory item with id:{Id} succesfully modified");

    public static readonly Action<ILogger, int, Exception?> LogInventoryItemDeletedSuccess =
        LoggerMessage.Define<int>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemDeletedSuccess,
            "Provided inventory item with id:{Id} deleted succesfully");

    public static readonly Action<ILogger, int, decimal, Exception?> LogInventoryItemQuantityIncreased =
        LoggerMessage.Define<int, decimal>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemQuantityIncreased,
            "Inventory item with id:{Id} quantity increased by {Amount} succesfully");

    public static readonly Action<ILogger, int, decimal, Exception?> LogInventoryItemAssignedToBinLocation =
        LoggerMessage.Define<int, decimal>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemAssignedToBinLocation,
            "Inventory item with id:{Id} assigned to bin location with code: {BinLocationCode} succesfully");

    public static readonly Action<ILogger, int, decimal, Exception?> LogInventoryItemQuantityDecreased =
        LoggerMessage.Define<int, decimal>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemQuantityDecreased,
            "Inventory item with id:{Id} quantity decreased by {Amount} succesfully");

    public static readonly Action<ILogger, int, decimal, Exception?> LogInventoryItemQuantityReserved =
        LoggerMessage.Define<int, decimal>(
            LogLevel.Information,
            InventoryItemLogEventIds.InventoryItemQuantityReserved,
            "Inventory item with id:{Id} quantity reserved by {Amount} succesfully");
}
