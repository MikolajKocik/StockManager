using StockManager.Core.Domain.Models.ShipmentEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IShipmentRepository : IBaseRepository
{
    Task<Shipment?> GetShipmentByIdAsync(int id, CancellationToken ct = default);
    void AddShipment(Shipment shipment);
    IQueryable<Shipment> GetShipments();
    Task DeleteShipmentAsync(int id, CancellationToken ct = default);
}

