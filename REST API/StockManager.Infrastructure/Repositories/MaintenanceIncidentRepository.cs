using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;


namespace StockManager.Infrastructure.Repositories;

public sealed class MaintenanceIncidentRepository : IMaintenanceIncidentRepository
{
    private readonly StockManagerDbContext _dbContext;

    public MaintenanceIncidentRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<MaintenanceIncident> GetIncidents()
        => _dbContext.MaintenanceIncidents.AsQueryable();

    public Task<MaintenanceIncident?> GetIncidentByIdAsync(int id, CancellationToken cancellationToken)
        => _dbContext.MaintenanceIncidents
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<MaintenanceIncident?> GetIncidentWithDetailsByIdAsync(int id, CancellationToken cancellationToken)
        => _dbContext.MaintenanceIncidents
            .Include(i => i.ReportedBy)
            .Include(i => i.AssignedTo)
            .Include(i => i.Asset)
            .Include(i => i.BinLocation)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<bool> HasOtherActiveIncidentsForAssetAsync(Guid assetId, int currentIncidentId, CancellationToken cancellationToken)
        => _dbContext.MaintenanceIncidents
            .AnyAsync(i => i.AssetId == assetId && i.Id != currentIncidentId && i.Status != IncidentStatus.Resolved && i.Status != IncidentStatus.Cancelled, cancellationToken);


    public Task<MaintenanceIncident> AddIncidentAsync(MaintenanceIncident incident, CancellationToken cancellationToken)
        => RepositoryQueriesHelpers.AddEntityAsync(_dbContext, incident, cancellationToken);

    public async Task<MaintenanceIncident> UpdateIncidentAsync(MaintenanceIncident incident, CancellationToken cancellationToken)
    {
        if (_dbContext.Entry(incident).State == EntityState.Detached)
        {
            _dbContext.MaintenanceIncidents.Attach(incident);
            _dbContext.Entry(incident).State = EntityState.Modified;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return incident;
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
         => _dbContext.Database.BeginTransactionAsync(cancellationToken);
}
