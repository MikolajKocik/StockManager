using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.ShipmentEntity;

public sealed partial class Shipment
{
    public void MarkDelivered(DateTime deliveredDate)
    {
        if (Status != ShipmentStatus.InTransit)
        {
            throw new InvalidOperationException("Can only deliver when status is InTransit");
        }

        if (deliveredDate.Date < ShippedDate)
        {
            throw new ArgumentException("DeliveredDate cannot be before ShippedDate", nameof(deliveredDate));
        }

        Guard.IsValidDate(deliveredDate, nameof(deliveredDate));

        DeliveredDate = deliveredDate.Date;
        Status = ShipmentStatus.Delivered;
    }

    public void Cancel()
    {
        if (Status == ShipmentStatus.Delivered)
        {
            throw new InvalidOperationException("Cannot cancel a delivered shipment");
        }

        Status = ShipmentStatus.Cancelled;
    }

    public void MarkReturned()
    {
        if (Status != ShipmentStatus.Delivered && Status != ShipmentStatus.InTransit)
        {
            throw new InvalidOperationException("Can only return a shipment that was sent or delivered");
        }

        Status = ShipmentStatus.Returned;
    }
}
