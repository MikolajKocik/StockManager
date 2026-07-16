using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IStockTransactionRepository
{
    IQueryable<StockTransaction> GetStockTransactions();
    Task<StockTransaction?> GetStockTransactionByIdAsync(int id, CancellationToken ct);
    void AddStockTransaction(StockTransaction transaction);
    Task DeleteStockTransactionAsync(int id, CancellationToken cancellationToken);
}
