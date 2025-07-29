using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Helpers;

namespace StockManager.Infrastructure.Repositories;
public sealed class ShipmentRepository : IShipmentRepository
{
    public readonly StockManagerDbContext _dbContext;

    public ShipmentRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<Shipment> GetShipments()
        => _dbContext.Shipments
           .AsNoTracking()
           .Include(so => so.SalesOrder);            

    public async Task<Shipment?> GetShipmentByIdAsync(int id, CancellationToken cancellationToken)
        => await _dbContext.Shipments
            .Where(s => s.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    
    public async Task<Shipment> AddShipmentAsync(Shipment shipment, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, shipment, cancellationToken);

    public async Task<Shipment?> UpdateShipmentAsync(Shipment shipment, CancellationToken cancellationToken) 
    {
        _dbContext.Shipments.Update(shipment);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return shipment;
    }

    public async Task<Shipment?> DeleteShipmentAsync(Shipment shipment, CancellationToken cancellationToken)
    {
        _dbContext.Shipments.Remove(shipment);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return shipment;
    }
}
