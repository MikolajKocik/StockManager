using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IMaintenanceIncidentRepository : IBaseRepository
{
    IQueryable<MaintenanceIncident> GetIncidents();
    Task<MaintenanceIncident?> GetIncidentByIdAsync(int id, CancellationToken cancellationToken);
    Task<MaintenanceIncident?> GetIncidentWithDetailsByIdAsync(int id, CancellationToken cancellationToken);
    Task<bool> HasOtherActiveIncidentsForAssetAsync(Guid assetId, int currentIncidentId, CancellationToken cancellationToken);
    Task<MaintenanceIncident> AddIncidentAsync(MaintenanceIncident incident, CancellationToken cancellationToken);
    Task<MaintenanceIncident> UpdateIncidentAsync(MaintenanceIncident incident, CancellationToken cancellationToken);
}

