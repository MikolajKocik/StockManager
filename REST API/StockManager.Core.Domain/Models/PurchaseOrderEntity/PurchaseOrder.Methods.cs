using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Core.Domain.Models.PurchaseOrderEntity;

public sealed partial class PurchaseOrder
{
    public void SetExpectedDate(DateTime expected)
    {
        if (expected.Date < OrderDate)
        {
            throw new ArgumentException("ExpectedDate cannot be before OrderDate", nameof(expected));
        }

        ExpectedDate = expected.Date;
    }

    public void AddLine(PurchaseOrderLine line)
    {
        Guard.AgainstNull(line);

        if (Status != PurchaseOrderStatus.Draft)
        {
            throw new InvalidOperationException("Cannot add lines unless Draft");
        }

        _purchaseOrderLines.Add(line);
    }

    public void Confirm()
    {
        if (!_purchaseOrderLines.Any())
        {
            throw new InvalidOperationException("Must have at least one line");
        }

        Status = PurchaseOrderStatus.Submitted;
    }

    public void AssignInvoice(int invoiceId)
    {
        Guard.AgainstDefaultValue(invoiceId);

        if (InvoiceId.HasValue)
        {
            throw new InvalidOperationException($"An invoice (ID: {InvoiceId.Value}) is already assigned to this Purchase Order. Cannot assign another invoice (ID: {invoiceId}).");
        }

        InvoiceId = invoiceId;
    }

    public void AssignReturnOrder(int returnOrderId)
    {
        Guard.AgainstDefaultValue(returnOrderId);

        if (ReturnOrderId.HasValue)
        {
            throw new InvalidOperationException($"A return order (ID: {ReturnOrderId.Value}) is already assigned to this Purchase Order. Cannot assign another return order (ID: {returnOrderId}).");
        }

        ReturnOrderId = returnOrderId;
    }
}
