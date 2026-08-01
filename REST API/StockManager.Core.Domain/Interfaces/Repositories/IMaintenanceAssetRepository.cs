using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IMaintenanceAssetRepository : IBaseRepository
{
    IQueryable<MaintenanceAsset> GetAssets();
    Task<MaintenanceAsset?> GetAssetByIdAsync(Guid id, CancellationToken ct = default);
    Task<MaintenanceAsset?> GetAssetWithDetailsByIdAsync(Guid id, CancellationToken ct = default);
    void AddAsset(MaintenanceAsset asset);
}

