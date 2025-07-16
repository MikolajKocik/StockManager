using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.InvoiceEntity;

public sealed partial class Invoice
{
    public int Id { get; private set; }
    public InvoiceType Type { get; private set; }
    public int? PurchaseOrderId { get; private set; }
    public int? SalesOrderId { get; private set; }
    public DateTime InvoiceDate { get; private set; }
    public DateTime? DueDate { get; private set; }
    public InvoiceStatus Status { get; private set; }
    public decimal TotalAmount { get; private set; }

    private Invoice() { }

    public Invoice(
        InvoiceType type,
        DateTime invoiceDate,
        decimal totalAmount,
        DateTime? dueDate = null,
        int? purchaseOrderId = null,
        int? salesOrderId = null
        )
    {
        if (totalAmount < 0)
        {
            throw new ArgumentException("TotalAmount must be greater or equal to zero", nameof(totalAmount));
        }

        if (dueDate.HasValue && dueDate.Value < invoiceDate)
        {
            throw new ArgumentException("DueDate cannot be before InvoiceDate", nameof(dueDate));
        }

        Type = type;
        InvoiceDate = invoiceDate.Date;
        TotalAmount = totalAmount;
        DueDate = dueDate?.Date;
        PurchaseOrderId = purchaseOrderId;
        SalesOrderId = salesOrderId;
        Status = InvoiceStatus.Draft;
    }
}
