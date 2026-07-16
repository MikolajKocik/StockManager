using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class MaintenanceAssetRepository(StockManagerDbContext db)
    : BaseOperations<MaintenanceAsset>(db), IMaintenanceAssetRepository
{
    public IQueryable<MaintenanceAsset> GetAssets() 
        => GetAll()
            .AsNoTracking();

    public async Task<MaintenanceAsset?> GetAssetByIdAsync(Guid id, CancellationToken ct)
        => await _db.MaintenanceAssets.SingleOrDefaultAsync(x => x.Id == id, ct);

    public async Task<MaintenanceAsset?> GetAssetWithDetailsByIdAsync(Guid id, CancellationToken cancellationToken)
        => await _db.MaintenanceAssets
            .Include(a => a.BinLocation)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public void AddAsset(MaintenanceAsset asset)
        => Add(asset);
}
