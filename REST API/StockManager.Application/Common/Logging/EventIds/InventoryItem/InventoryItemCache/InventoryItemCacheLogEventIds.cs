using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.InventoryItem.InventoryItemCache;
public static class InventoryItemCacheLogEventIds
{
    public static readonly EventId ReturnCacheFromInventoryItem = new(1001, "ReturnCacheFromInventoryItem");
    public static readonly EventId StoredKeys = new(1002, "StoredKeys");
}
