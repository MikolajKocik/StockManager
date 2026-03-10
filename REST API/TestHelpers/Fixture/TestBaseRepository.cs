using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using System.Data.Common;

namespace TestHelpers.Fixture;

internal sealed class TestBaseRepository : IBaseRepository
{
    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
    {
        IDbContextTransaction tx = new TestDbContextTransaction();
        return Task.FromResult(tx);
    }
}

internal sealed class TestDbContextTransaction : IDbContextTransaction
{
    public Guid TransactionId { get; } = Guid.NewGuid();

    public DbTransaction GetDbTransaction()
    {
        return null!; 
    }

    public void Commit()
    {
        // no-op
    }

    public Task CommitAsync(CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    public void Rollback()
    {
        // no-op
    }

    public Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        // no-op
    }

    public ValueTask DisposeAsync()
    {
        return ValueTask.CompletedTask;
    }
}
