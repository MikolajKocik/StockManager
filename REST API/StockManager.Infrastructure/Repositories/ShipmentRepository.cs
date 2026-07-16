using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class ShipmentRepository(StockManagerDbContext db) 
    : BaseOperations<Shipment>(db), IShipmentRepository
{
    public IQueryable<Shipment> GetShipments()
        => GetAll()
            .AsNoTracking();

    public async Task<Shipment?> GetShipmentByIdAsync(int id, CancellationToken ct)
        => await _db.Shipments
            .Where(s => s.Id == id)
            .AsNoTracking()
            .SingleOrDefaultAsync(ct);
    
    public void AddShipment(Shipment shipment)
        => Add(shipment);

    public async Task DeleteShipmentAsync(int id, CancellationToken ct)
    {
        Shipment shipment = await _db.Shipments.FindAsync([id], ct) 
            ?? throw new InvalidOperationException($"Shipment with id {id} not found.");
        Delete(shipment);
    }
}
