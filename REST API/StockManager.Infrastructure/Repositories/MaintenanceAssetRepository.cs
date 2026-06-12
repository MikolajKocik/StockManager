using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public sealed class MaintenanceAssetRepository : IMaintenanceAssetRepository
{
    private readonly StockManagerDbContext _dbContext;

    public MaintenanceAssetRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<MaintenanceAsset> GetAssets()
        => _dbContext.MaintenanceAssets.AsQueryable();

    public Task<MaintenanceAsset?> GetAssetByIdAsync(Guid id, CancellationToken cancellationToken)
        => _dbContext.MaintenanceAssets
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<MaintenanceAsset?> GetAssetWithDetailsByIdAsync(Guid id, CancellationToken cancellationToken)
        => _dbContext.MaintenanceAssets
            .Include(a => a.BinLocation)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);


    public Task<MaintenanceAsset> AddAssetAsync(MaintenanceAsset asset, CancellationToken cancellationToken)
        => RepositoryQueriesHelpers.AddEntityAsync(_dbContext, asset, cancellationToken);

    public async Task<MaintenanceAsset> UpdateAssetAsync(MaintenanceAsset asset, CancellationToken cancellationToken)
    {
        if (_dbContext.Entry(asset).State == EntityState.Detached)
        {
            _dbContext.MaintenanceAssets.Attach(asset);
            _dbContext.Entry(asset).State = EntityState.Modified;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return asset;
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
         => _dbContext.Database.BeginTransactionAsync(cancellationToken);
}
