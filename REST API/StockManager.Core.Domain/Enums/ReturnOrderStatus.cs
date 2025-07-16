using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Enums;

public enum ReturnOrderStatus 
{
    Draft,
    Confirmed,
    Completed,
    Cancelled 
}
