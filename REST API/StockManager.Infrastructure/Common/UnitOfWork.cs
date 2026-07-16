using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Infrastructure.Persistence.Data;
namespace StockManager.Infrastructure.Common;

public sealed class UnitOfWork(StockManagerDbContext dbContext) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => dbContext.SaveChangesAsync(cancellationToken);
}