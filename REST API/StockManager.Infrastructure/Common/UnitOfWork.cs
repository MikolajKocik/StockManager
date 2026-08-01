using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore.Storage;
namespace StockManager.Infrastructure.Common;

internal sealed class UnitOfWork(StockManagerDbContext db) : IUnitOfWork
{
    public async Task<ITransaction> BeginTransactionAsync(CancellationToken ct)
    {
        IDbContextTransaction tx = await db.Database.BeginTransactionAsync(ct);
        return new EfTransaction(tx);
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => db.SaveChangesAsync(ct);
}