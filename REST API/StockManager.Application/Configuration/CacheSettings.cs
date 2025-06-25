using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Configuration;

public class CacheSettings
{
    public int ProductAbsoluteTtlHours { get; set; } = 6;
    public int ProductSlidingTtlMinutes { get; set; } = 60;
}
