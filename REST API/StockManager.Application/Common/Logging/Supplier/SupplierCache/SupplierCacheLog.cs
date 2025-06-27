using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Supplier.SupplierCache;

namespace StockManager.Application.Common.Logging.Supplier.SupplierCache;

public static class SupplierCacheLog
{
    public static readonly Action<ILogger, string, Exception?> ReturnCacheFromSupplier =
        LoggerMessage.Define<string>(
            LogLevel.Information,
            SupplierCacheLogEventIds.ReturnCacheFromSupplier,
            "Return cache supplier (key={CacheKey})");

    public static readonly Action<ILogger, string, int, int, Exception?> StoredKeys =
     LoggerMessage.Define<string, int, int>(
         LogLevel.Information,
         SupplierCacheLogEventIds.StoredKeys,
         "Stored {Key} in cache for {Abs}h absolute, {Slide}m sliding");
}
