using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class ReturnOrderService : IReturnOrderService
{
    public void AddLine(ReturnOrder order, ReturnOrderLine line)
        => order.AddLine(line);
    public void Complete(ReturnOrder order)
        => order.Complete();

    public void Confirm(ReturnOrder order)
        => order.Confirm();
}
