using StockManager.Core.Domain.Models.StockTransactionEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IStockTransactionRepository : IBaseRepository
{
    IQueryable<StockTransaction> GetStockTransactions();
    Task<StockTransaction?> GetStockTransactionByIdAsync(int id, CancellationToken ct);
    void AddStockTransaction(StockTransaction transaction);
    Task DeleteStockTransactionAsync(int id, CancellationToken cancellationToken);
}
