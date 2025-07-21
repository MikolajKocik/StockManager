using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.InvoiceEntity;

public sealed partial class Invoice : Entity<int>
{
    public InvoiceType Type { get; private set; }
    public DateTime InvoiceDate { get; private set; }
    public DateTime? DueDate { get; private set; }
    public InvoiceStatus Status { get; private set; }
    public decimal TotalAmount { get; private set; }

    // relation 1-1 with purchaseOrder
    public int? PurchaseOrderId { get; private set; }
    public PurchaseOrder? PurchaseOrder { get; private set; }

    // relation 1-1 with salesOrder
    public SalesOrder? SalesOrder { get; private set; }
    public int? SalesOrderId { get; private set; }


    private Invoice() : base() { }

    public Invoice(
        InvoiceType type,
        DateTime invoiceDate,
        decimal totalAmount,
        DateTime? dueDate = null,
        int? purchaseOrderId = null,
        int? salesOrderId = null
        ) : base()
    {
        Guard.DecimalValueGreaterThanZero(totalAmount);
        ValidateInvoiceDates(invoiceDate, dueDate);
        ValidateOrderAssociations(purchaseOrderId, salesOrderId);
        Guard.AgainstInvalidEnumValue(type);
        Guard.SetOptionalDate(dueDate, date => dueDate = date, nameof(dueDate));
        Guard.AgainstInvalidEnumValue(type);

        Type = type;
        InvoiceDate = invoiceDate.Date;
        TotalAmount = totalAmount;
        PurchaseOrderId = purchaseOrderId;
        SalesOrderId = salesOrderId;
        Status = InvoiceStatus.Draft;
    }

    public Invoice(
        int id,
        InvoiceType type,
        DateTime invoiceDate,
        decimal totalAmount,
        DateTime? dueDate = null,
        int? purchaseOrderId = null,
        int? salesOrderId = null
        ) : base(id)
    {
        Guard.DecimalValueGreaterThanZero(totalAmount);
        ValidateInvoiceDates(invoiceDate, dueDate);
        ValidateOrderAssociations(purchaseOrderId, salesOrderId);
        Guard.AgainstInvalidEnumValue(type);
        Guard.SetOptionalDate(dueDate, date => dueDate = date, nameof(dueDate));
        Guard.AgainstInvalidEnumValue(type);

        Type = type;
        InvoiceDate = invoiceDate.Date;
        TotalAmount = totalAmount;
        PurchaseOrderId = purchaseOrderId;
        SalesOrderId = salesOrderId;
        Status = InvoiceStatus.Draft;
    }
}
