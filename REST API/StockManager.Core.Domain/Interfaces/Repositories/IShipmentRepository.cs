using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IShipmentRepository 
{
    Task<Shipment?> GetShipmentByIdAsync(int id, CancellationToken cancellationToken);
    Task<Shipment> AddShipmentAsync(Shipment shipment, CancellationToken cancellationToken);
    Task<Shipment?> UpdateShipmentAsync(Shipment shipment, CancellationToken cancellationToken);
    IQueryable<Shipment> GetShipments();
    Task<Shipment?> DeleteShipmentAsync(Shipment shipment, CancellationToken cancellationToken);
}

