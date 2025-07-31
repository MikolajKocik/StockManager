using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IPurchaseOrderService
{
    void SetExpectedDate(PurchaseOrder order, DateTime expected);
    void AddLine(PurchaseOrder order, PurchaseOrderLine line);
    void Confirm(PurchaseOrder order);
    void AssignReturnOrder(PurchaseOrder order, int returnOrderId);
    void AssignInvoice(PurchaseOrder order, int invoiceId);
}
