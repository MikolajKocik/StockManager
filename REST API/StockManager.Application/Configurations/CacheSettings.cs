using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Configurations;

public sealed class CacheSettings
{
    public int AbsoluteTtlHours { get; set; } = 6;
    public int SlidingTtlMinutes { get; set; } = 60;

    //
    public int ProductAbsoluteTtlHours => AbsoluteTtlHours;
    public int ProductSlidingTtlMinutes => SlidingTtlMinutes;

    //
    public int SupplierAbsoluteTtlHours => AbsoluteTtlHours;
    public int SupplierSlidingTtlMinutes => SlidingTtlMinutes;

    //
    public int InventoryItemAbsoluteTtlHours => AbsoluteTtlHours;
    public int InventoryItemSlidingTtlMinutes => SlidingTtlMinutes;

}
