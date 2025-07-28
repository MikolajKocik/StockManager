using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.InventoryItem.InventoryItemCache;
using StockManager.Application.Common.Logging.EventIds.Product.ProductCache;

namespace StockManager.Application.Common.Logging.InventoryItem.InventoryItemCache;
public static class InventoryItemCacheLog
{
    public static readonly Action<ILogger, string, Exception?> ReturnCacheFromInventoryItem =
    LoggerMessage.Define<string>(
        LogLevel.Information,
        InventoryItemCacheLogEventIds.ReturnCacheFromInventoryItem,
        "Return cache inventory-item (key={CacheKey})"
    );

    public static readonly Action<ILogger, string, int, int, Exception?> StoredKeys =
        LoggerMessage.Define<string, int, int>(
            LogLevel.Information,
            InventoryItemCacheLogEventIds.StoredKeys,
            "Stored {Key} in cache for {Abs}h absolute, {Slide}m sliding");
}
