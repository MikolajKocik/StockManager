using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class PurchaseOrderService : IPurchaseOrderService
{
    public void AddLine(PurchaseOrder order, PurchaseOrderLine line)
        => order.AddLine(line);

    public void Confirm(PurchaseOrder order)
        => order.Confirm();

    public void SetExpectedDate(PurchaseOrder order, DateTime expected)
        => order.SetExpectedDate(expected);
}
