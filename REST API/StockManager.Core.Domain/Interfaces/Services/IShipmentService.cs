using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IShipmentService
{
    void MarkDelivered(Shipment shipment, DateTime deliveredDate);
    void Cancel(Shipment shipment);
    void MarkReturned(Shipment shipment);
}
