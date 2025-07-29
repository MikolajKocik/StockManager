using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IStockTransactionRepository
{
    IQueryable<StockTransaction> GetStockTransactions();
    Task<StockTransaction?> GetStockTransactionByIdAsync(int id, CancellationToken cancellationToken);
    Task<StockTransaction> AddStockTransactionAsync(StockTransaction entity, CancellationToken cancellationToken);
    Task<StockTransaction?> UpdateStockTransactionAsync(StockTransaction entity, CancellationToken cancellationToken);
    Task<StockTransaction?> DeleteStockTransactionAsync(StockTransaction entity, CancellationToken cancellationToken);
}
