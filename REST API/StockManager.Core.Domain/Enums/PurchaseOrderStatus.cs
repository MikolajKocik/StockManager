using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Enums;

public enum PurchaseOrderStatus
{
    Draft,         // created but not shipped yet
    Submitted,    
    PartiallyReceived, 
    Received,     
    Cancelled,     
    Closed         
}
