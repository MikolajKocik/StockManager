using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Core.Domain.Models.SalesOrderEntity;

public sealed partial class SalesOrder
{
    public int Id { get; private set; }
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
    public int ReturnOrderId { get; private set; }
    public ReturnOrder ReturnOrder { get; private set; }

    private SalesOrder() { }
    public SalesOrder(
        int customerId,
        DateTime orderDate,
        int returnOrderId,
        int invoiceId
        )
    {
        // to do id general method

        if (customerId <= 0)
        {
            throw new ArgumentException("Not valid customer");
        }

        if (invoiceId <= 0)
        {
            throw new ArgumentException("Not valid invoice");
        }

        if (returnOrderId <= 0)
        {
            throw new ArgumentException("Not valid invoice");
        }

        if (orderDate > DateTime.UtcNow)
        {
            throw new ArgumentException("Future order date");
        }

        CustomerId = customerId;
        OrderDate = orderDate;
        Status = SalesOrderStatus.Draft;
        InvoiceId = invoiceId;
        ReturnOrderId = returnOrderId;
    }
}
