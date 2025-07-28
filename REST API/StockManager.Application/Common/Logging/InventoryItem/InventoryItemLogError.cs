using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.InventoryItem.InventoryItemCache;

namespace StockManager.Application.Common.Logging.InventoryItem;

public static class InventoryItemLogError
{
    public static readonly Action<ILogger, Exception?> LogEditingInventoryItemException =
   LoggerMessage.Define(
       LogLevel.Error,
       InventoryItemLogEventIds.EditingInventoryItemException,
       "Error occured while editing inventory item data");

    public static readonly Action<ILogger, Exception?> LogRemovingInventoryItemException =
      LoggerMessage.Define(
          LogLevel.Error,
          InventoryItemLogEventIds.RemovingInventoryItemException,
          "Error occured while removing inventory item");
}
