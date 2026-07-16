using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IMaintenanceAssetRepository
{
    IQueryable<MaintenanceAsset> GetAssets();
    Task<MaintenanceAsset?> GetAssetByIdAsync(Guid id, CancellationToken ct = default);
    Task<MaintenanceAsset?> GetAssetWithDetailsByIdAsync(Guid id, CancellationToken ct = default);
    void AddAsset(MaintenanceAsset asset);
}

