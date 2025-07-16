using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IReturnOrderService
{
    void AddLine(ReturnOrder order, ReturnOrderLine line);
    void Confirm(ReturnOrder order);
    void Complete(ReturnOrder order);
}
