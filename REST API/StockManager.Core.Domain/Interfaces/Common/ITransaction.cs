namespace StockManager.Core.Domain.Interfaces.Common;

public interface ITransaction : IAsyncDisposable
{
    Task CommitAsync(CancellationToken ct);
    Task RollbackAsync(CancellationToken ct);    
}