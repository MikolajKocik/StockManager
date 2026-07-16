using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Infrastructure.Common;

internal sealed class EfTransaction(IDbContextTransaction transaction) : ITransaction
{
    public Task CommitAsync(CancellationToken ct = default) => transaction.CommitAsync(ct);
    public Task RollbackAsync(CancellationToken ct = default) => transaction.RollbackAsync(ct);
    public ValueTask DisposeAsync() => transaction.DisposeAsync();
}
