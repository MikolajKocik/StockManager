using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Core.Domain.Models.SalesOrderEntity;

public sealed partial class SalesOrder : Entity<int>
{
    public DateTime OrderDate { get; private set; }
    public DateTime? ShipDate { get; private set; }
    public DateTime? DeliveredDate { get; private set; }
    public DateTime? CancelDate { get; private set; }
    public SalesOrderStatus Status { get; private set; }

    // relation *-1 with customer
    public int CustomerId { get; private set; }
    public Customer Customer { get; private set; }

    // relation 1-* with salesOrderLines
    private readonly List<SalesOrderLine> _salesOrderlines = new();
    public IReadOnlyList<SalesOrderLine> SalesOrderLines
        => _salesOrderlines.AsReadOnly();

    // relation 1-* with shipment
    private readonly List<Shipment> _shipments = new();
    public IReadOnlyCollection<Shipment> Shipments
        => _shipments.AsReadOnly();

    // relation 1-1 with invoice
    public int InvoiceId { get; private set; }
    public Invoice Invoice { get; private set; }

    // relation 1-1 with returnOrder
    public int? ReturnOrderId { get; private set; }
    public ReturnOrder? ReturnOrder { get; private set; }

    private SalesOrder() : base() { }

    public SalesOrder(
        int customerId,
        DateTime orderDate,
        int? returnOrderId,
        int invoiceId,
        DateTime? shipDate = null,
        DateTime? deliveredDate = null,
        DateTime? cancelDate = null
        ) : base()
    {
        Guard.AgainstDefaultValue(customerId, invoiceId);
        Guard.AgainstDefaultValueIfProvided(returnOrderId);
        Guard.IsValidDate(orderDate);

        Guard.SetOptionalDate(shipDate, date => shipDate = date, nameof(shipDate));
        Guard.SetOptionalDate(deliveredDate, date => deliveredDate = date, nameof(deliveredDate));
        Guard.SetOptionalDate(cancelDate, date => cancelDate = date, nameof(cancelDate));

        CustomerId = customerId;
        OrderDate = orderDate;
        Status = SalesOrderStatus.Draft;
        InvoiceId = invoiceId;
        ReturnOrderId = returnOrderId;
    }

    public SalesOrder(
        int id,
        int customerId,
        DateTime orderDate,
        int? returnOrderId,
        int invoiceId,
        DateTime? shipDate = null,
        DateTime? deliveredDate = null,
        DateTime? cancelDate = null
     ) : base(id)
    {
        Guard.AgainstDefaultValue(customerId, invoiceId);
        Guard.AgainstDefaultValueIfProvided(returnOrderId);
        Guard.IsValidDate(orderDate);

        Guard.SetOptionalDate(shipDate, date => shipDate = date, nameof(shipDate));
        Guard.SetOptionalDate(deliveredDate, date => deliveredDate = date, nameof(deliveredDate));
        Guard.SetOptionalDate(cancelDate, date => cancelDate = date, nameof(cancelDate));

        CustomerId = customerId;
        OrderDate = orderDate;
        Status = SalesOrderStatus.Draft;
        InvoiceId = invoiceId;
        ReturnOrderId = returnOrderId;
    }
}
