using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class MaintenanceIncidentRepository(StockManagerDbContext db) 
    : BaseOperations<MaintenanceIncident>(db), IMaintenanceIncidentRepository
{
    private static readonly HashSet<IncidentStatus> _activeStatuses =
        new([IncidentStatus.Reported, IncidentStatus.InProgress]);

    public IQueryable<MaintenanceIncident> GetIncidents()
        => GetAll()
            .AsNoTracking()      
            .Include(i => i.ReportedBy)
            .Include(i => i.AssignedTo)
            .Include(i => i.Asset)
            .Include(i => i.BinLocation);

    public async Task<MaintenanceIncident?> GetIncidentByIdAsync(int id, CancellationToken ct)
        => await _db.MaintenanceIncidents
            .SingleOrDefaultAsync(x => x.Id == id, ct);
    
    public async Task<MaintenanceIncident?> GetIncidentWithDetailsByIdAsync(int id, CancellationToken ct)
        => await _db.MaintenanceIncidents
            .Include(i => i.ReportedBy)
            .Include(i => i.AssignedTo)
            .Include(i => i.Asset)
            .Include(i => i.BinLocation)
            .SingleOrDefaultAsync(x => x.Id == id, ct);

    public void AddIncident(MaintenanceIncident incident)
        => Add(incident);

    public async Task<bool> HasOtherActiveIncidentsForAssetAsync(Guid assetId, int currentIncidentId, CancellationToken ct)
        => await _db.MaintenanceIncidents
            .AnyAsync(i => i.AssetId == assetId 
                && i.Id != currentIncidentId 
                && _activeStatuses.Contains(i.Status), ct);
}
