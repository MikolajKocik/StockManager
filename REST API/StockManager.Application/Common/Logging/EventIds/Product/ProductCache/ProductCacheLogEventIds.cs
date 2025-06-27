using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.Product.ProductCache;

public static class ProductCacheLogEventIds
{
    public static readonly EventId ReturnCacheFromProduct = new(120, "ReturnCacheFromProduct");
    public static readonly EventId StoredKeys = new(121, "StoredKeys");
}
