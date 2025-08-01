using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.EventIds.Product.ProductCache;
using StockManager.Application.Configurations;

namespace StockManager.Application.Common.Logging.Product.ProductCache;

public static class ProductCacheLog
{
    public static readonly Action<ILogger, string, Exception?> ReturnCacheFromProduct =
        LoggerMessage.Define<string>(
            LogLevel.Information,
            ProductCacheLogEventIds.ReturnCacheFromProduct,
            "Return cache product (key={CacheKey})"
        );

    public static readonly Action<ILogger, string, int, int, Exception?> StoredKeys =
        LoggerMessage.Define<string, int, int>(
            LogLevel.Information,
            ProductCacheLogEventIds.StoredKeys,
            "Stored {Key} in cache for {Abs}h absolute, {Slide}m sliding");
}
