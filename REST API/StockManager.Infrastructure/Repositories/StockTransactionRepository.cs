using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class StockTransactionRepository(StockManagerDbContext db) 
    : BaseOperations<StockTransaction>(db), IStockTransactionRepository
{
    public void AddStockTransaction(StockTransaction stockTransaction)
        => Add(stockTransaction);

    public async Task DeleteStockTransactionAsync(int id , CancellationToken ct)
    {
        StockTransaction? transaction = await _db.StockTransactions.FindAsync([id], ct)
            ?? throw new InvalidOperationException($"StockTransaction with id {id} not found.");
        Delete(transaction);
    }

    public Task<StockTransaction?> GetStockTransactionByIdAsync(int id, CancellationToken ct)
        => _db.StockTransactions
            .Include(st => st.InventoryItemId)
            .Include(st => st.TargetLocationId)
            .SingleOrDefaultAsync(st => st.Id == id, ct);

    public IQueryable<StockTransaction> GetStockTransactions()
        => GetAll()
            .AsNoTracking()
            .Include(st => st.InventoryItemId)
            .Include(st => st.TargetLocationId);
}
