using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Models.PurchaseOrderEntity;

public sealed partial class PurchaseOrder : Entity<int>
{
    public DateTime OrderDate { get; private set; }
    public DateTime? ExpectedDate { get; private set; }
    public PurchaseOrderStatus Status { get; private set; }

    // relation *-1 with supplier
    public Supplier Supplier { get; private set; }
    public int SupplierId { get; private set; }

    // relation 1-* with purchaseOrderLines
    private readonly List<PurchaseOrderLine> _purchaseOrderLines = new();
    public IReadOnlyCollection<PurchaseOrderLine> PurchaseOrderLines
        => _purchaseOrderLines.AsReadOnly();

    // relation 1-1 with invoice
    public int? InvoiceId { get; private set; }
    public Invoice? Invoice { get; private set; }

    // relation 1-1 with returnOrder
    public int? ReturnOrderId { get; private set; }
    public ReturnOrder? ReturnOrder { get; private set; }

    private PurchaseOrder() : base() { }

    public PurchaseOrder(
        int id,
        int supplierId,
        DateTime orderDate,      
        int returnOrderId,
        int invoiceId,
        DateTime? expectedDate = null
        ) : base(id)
    {
        Guard.AgainstDefaultValue(supplierId, returnOrderId, invoiceId);
        Guard.IsValidDate(orderDate);
        Guard.SetOptionalDate(expectedDate, date => expectedDate = date, nameof(expectedDate));

        SupplierId = supplierId;
        OrderDate = orderDate.Date;
        Status = PurchaseOrderStatus.Draft;
        InvoiceId = invoiceId;
        ReturnOrderId = returnOrderId;
    }

    public PurchaseOrder(
       int supplierId,
       DateTime orderDate,
       int returnOrderId,
       int invoiceId,
       DateTime? expectedDate = null
       ) : base()
    {
        Guard.AgainstDefaultValue(supplierId, returnOrderId, invoiceId);
        Guard.IsValidDate(orderDate);
        Guard.SetOptionalDate(expectedDate, date => expectedDate = date, nameof(expectedDate));

        SupplierId = supplierId;
        OrderDate = orderDate.Date;
        Status = PurchaseOrderStatus.Draft;
        InvoiceId = invoiceId;
        ReturnOrderId = returnOrderId;
        ExpectedDate = expectedDate;
    }
}
