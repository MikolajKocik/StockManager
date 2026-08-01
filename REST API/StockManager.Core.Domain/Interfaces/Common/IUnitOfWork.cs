namespace StockManager.Core.Domain.Interfaces.Common;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task<ITransaction> BeginTransactionAsync(CancellationToken ct);
}