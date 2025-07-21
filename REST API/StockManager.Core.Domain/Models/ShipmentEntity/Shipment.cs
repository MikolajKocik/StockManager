using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.ShipmentEntity;

public sealed partial class Shipment : Entity<int>
{
    public string TrackingNumber { get; private set; }
    public ShipmentStatus Status { get; private set; }

    public DateTime ShippedDate { get; private set; }
    public DateTime? DeliveredDate { get; private set; }

    // relation *-1 with salesOrder
    public int SalesOrderId { get; private set; }
    public SalesOrder SalesOrder { get; private set; }

    private Shipment() : base() { }
    public Shipment(
        int salesOrderId,
        string trackingNumber,
        ShipmentStatus status,
        DateTime shippedDate,
        DateTime? deliveredDate = null
        ) : base()
    {
        Guard.AgainstDefaultValue(salesOrderId);
        Guard.AgainstNullOrWhiteSpace(trackingNumber);
        Guard.IsValidDate(shippedDate);
        Guard.AgainstInvalidEnumValue(status);
        Guard.SetOptionalDate(deliveredDate, date => deliveredDate = date, nameof(deliveredDate));

        SalesOrderId = salesOrderId;
        TrackingNumber = trackingNumber;
        Status = status;
        ShippedDate = shippedDate;
    }

    public Shipment(
        int id,
        int salesOrderId,
        string trackingNumber,
        ShipmentStatus status,
        DateTime shippedDate,
        DateTime? deliveredDate = null
       ) : base(id)
    {
        Guard.AgainstDefaultValue(salesOrderId);
        Guard.AgainstNullOrWhiteSpace(trackingNumber);
        Guard.IsValidDate(shippedDate);
        Guard.SetOptionalDate(deliveredDate, date => deliveredDate = date, nameof(deliveredDate));
        Guard.AgainstInvalidEnumValue(status);

        SalesOrderId = salesOrderId;
        TrackingNumber = trackingNumber;
        Status = status;
        ShippedDate = shippedDate;
    }
}
