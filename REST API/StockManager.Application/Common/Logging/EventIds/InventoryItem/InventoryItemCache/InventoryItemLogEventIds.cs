using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.InventoryItem.InventoryItemCache;
public static class InventoryItemLogEventIds
{
    // Error
    public static readonly EventId EditingInventoryItemException = new(200, "EditingInventoryItemException");
    public static readonly EventId RemovingInventoryItemException = new(201, "RemovingInventoryItemException");

    // Warning
    public static readonly EventId InventoryItemNotFound = new(210, "InventoryItemNotFound");
    public static readonly EventId InventoryItemValidationFailed = new(211, "InventoryItemValidationFailed");
    public static readonly EventId InventoryItemValidationFailedExtended = new(212, "InventoryItemValidationFailedExtended");
    public static readonly EventId InventoryProductNotFound = new(213, "InventoryProductNotFound");
    public static readonly EventId InventoryBinLocationNotFound = new(214, "InventoryBinLocationNotFound");
    public static readonly EventId InventoryItemUpdateValidationFailed = new(215, "InventoryItemUpdateValidationFailed");

    // Information
    public static readonly EventId AddInventoryItemSuccesfull = new(220, "AddInventoryItemSuccesfull");
    public static readonly EventId RemovingInventoryItemOperation = new(221, "RemovingInventoryItemOperation");
    public static readonly EventId ModyfingInventoryItem = new(222, "ModyfingInventoryItem");
    public static readonly EventId ReturningListOfInventoryItemSuccessfull = new(223, "ReturningListOfInventoryItemSuccessfull");
    public static readonly EventId InventoryItemFoundSuccess = new(224, "InventoryItemFoundSuccess");
    public static readonly EventId InventoryItemModifiedSuccess = new(225, "InventoryItemsModifiedSuccess");
    public static readonly EventId InventoryItemDeletedSuccess = new(226, "InventoryItemDeletedSuccess");
    public static readonly EventId InventoryItemQuantityIncreased = new(227, "InventoryItemQuantityIncreased");
    public static readonly EventId InventoryItemQuantityDecreased = new(228, "InventoryItemQuantityDecreased");
    public static readonly EventId InventoryItemAssignedToBinLocation = new(229, "InventoryItemAssignedToBinLocation");
    public static readonly EventId InventoryItemValidationQuantityOperationFailed = new(230, "InventoryItemValidationQuantityOperationFailed");
    public static readonly EventId InventoryItemQuantityReserved = new(231, "InventoryItemQuantityReserved");
}
