using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.InvoiceEntity;

public sealed partial class Invoice
{
    private void ValidateInvoiceDates(DateTime invoiceDate, DateTime? dueDate) 
    {
        if (Equals(invoiceDate, default(DateTime)))
        {
            throw new ArgumentException("Invoice date cannot be its default value.", nameof(invoiceDate));
        }

        Guard.IsValidDate(invoiceDate);

        if (dueDate.HasValue && dueDate.Value.Date < invoiceDate.Date) 
        {
            throw new ArgumentException("Due date cannot be before invoice date.", nameof(dueDate));
        }
    }

    private static void ValidateOrderAssociations(int? purchaseOrderId, int? salesOrderId)
    {
        if (purchaseOrderId.HasValue)
        {
            Guard.AgainstDefaultValue(purchaseOrderId.Value);
        }

        if (salesOrderId.HasValue)
        {
            Guard.AgainstDefaultValue(salesOrderId.Value);
        }

        bool isPurchaseOrderLinked = purchaseOrderId.HasValue;
        bool isSalesOrderLinked = salesOrderId.HasValue;

        if (isPurchaseOrderLinked == isSalesOrderLinked) 
        {
            throw new ArgumentException("An invoice must be associated with exactly one of either a Purchase Order or a Sales Order, but not both, and not neither.",
                $"{nameof(purchaseOrderId)}, {nameof(salesOrderId)}");
        }
    }
}
