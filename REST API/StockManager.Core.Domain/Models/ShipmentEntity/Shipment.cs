using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.ShipmentEntity;

public sealed partial class Shipment
{
    public int Id { get; private set; }
    public int SalesOrderId { get; private set; }
    public SalesOrder SalesOrder { get; private set; }

    public string TrackingNumber { get; private set; }
    public ShipmentStatus Status { get; private set; }

    public DateTime ShippedDate { get; private set; }
    public DateTime? DeliveredDate { get; private set; }

    private Shipment() { }
    public Shipment(
        int salesOrderId,
        SalesOrder salesOrder,
        string trackingNumber,
        ShipmentStatus status,
        DateTime shippedDate,
        DateTime? deliveredDate = null
        )
    {
        ArgumentNullException.ThrowIfNull(salesOrder);

        ArgumentException.ThrowIfNullOrWhiteSpace(trackingNumber, nameof(trackingNumber));

        if (shippedDate.Date > DateTime.UtcNow.Date)
        {
            throw new ArgumentException("ShippedDate cannot be in the future", nameof(shippedDate));
        }

        if (deliveredDate.HasValue && deliveredDate.Value.Date > DateTime.UtcNow.Date)
        {
            throw new ArgumentException("DeliveredDate cannot be in the future", nameof(deliveredDate));
        }

        SalesOrderId = salesOrderId;
        SalesOrder = salesOrder;
        TrackingNumber = trackingNumber;
        Status = status;
        ShippedDate = shippedDate;
        DeliveredDate = deliveredDate;
    }
}
