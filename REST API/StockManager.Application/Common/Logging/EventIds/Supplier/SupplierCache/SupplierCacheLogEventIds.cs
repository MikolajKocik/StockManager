using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace StockManager.Application.Common.Logging.EventIds.Supplier.SupplierCache;

public static class SupplierCacheLogEventIds
{
    public static readonly EventId ReturnCacheFromSupplier = new(90, "ReturnCacheFromSupplier");
    public static readonly EventId StoredKeys = new(91, "StoredKeys");

}
