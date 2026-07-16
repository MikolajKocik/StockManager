using StockManager.Core.Domain.Models.ShipmentEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IShipmentRepository
{
    Task<Shipment?> GetShipmentByIdAsync(int id, CancellationToken ct = default);
    void AddShipment(Shipment shipment);
    IQueryable<Shipment> GetShipments();
    Task DeleteShipmentAsync(int id, CancellationToken ct = default);
}

