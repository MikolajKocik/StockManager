using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Configuration;

public sealed class CacheSettings
{
    public static int AbsoluteTtlHours { get; set; } = 6;
    public static int SlidingTtlMinutes { get; set; } = 60;

    //
    public int ProductAbsoluteTtlHours { get; } = AbsoluteTtlHours;
    public int ProductSlidingTtlMinutes { get; } = SlidingTtlMinutes;

    //
    public int SupplierAbsoluteTtlHours { get; } = AbsoluteTtlHours;
    public int SupplierSlidingTtlMinutes { get; } = SlidingTtlMinutes;
  
}
