using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IMaintenanceAssetRepository : IBaseRepository
{
    IQueryable<MaintenanceAsset> GetAssets();
    Task<MaintenanceAsset?> GetAssetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<MaintenanceAsset?> GetAssetWithDetailsByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<MaintenanceAsset> AddAssetAsync(MaintenanceAsset asset, CancellationToken cancellationToken);
    Task<MaintenanceAsset> UpdateAssetAsync(MaintenanceAsset asset, CancellationToken cancellationToken);
}

