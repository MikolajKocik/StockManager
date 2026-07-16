using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IMaintenanceIncidentRepository
{
    IQueryable<MaintenanceIncident> GetIncidents();
    Task<MaintenanceIncident?> GetIncidentByIdAsync(int id, CancellationToken ct);
    Task<MaintenanceIncident?> GetIncidentWithDetailsByIdAsync(int id, CancellationToken ct);
    Task<bool> HasOtherActiveIncidentsForAssetAsync(Guid assetId, int currentIncidentId, CancellationToken ct);
    void AddIncident(MaintenanceIncident incident);
}

