using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class ShipmentService : IShipmentService
{
    public void Cancel(Shipment shipment)
        => shipment.Cancel();

    public void MarkDelivered(Shipment shipment, DateTime deliveredDate)
        => shipment.MarkDelivered(deliveredDate);

    public void MarkReturned(Shipment shipment)
        => shipment.MarkReturned();
}
