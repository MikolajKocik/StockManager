using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.StockTransactionEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public class StockTransactionRepository : IStockTransactionRepository
{
    private readonly StockManagerDbContext _dbContext;

    public StockTransactionRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<StockTransaction> AddStockTransactionAsync(StockTransaction stockTransaction, CancellationToken cancellationToken)
            => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, stockTransaction, cancellationToken);


    public async Task<StockTransaction?> DeleteStockTransactionAsync(StockTransaction stockTransaction, CancellationToken cancellationToken)
    {
        StockTransaction? exist = await _dbContext.StockTransactions
            .Where(st => st.Id == stockTransaction.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if(exist is null)
        {
            return null;
        }

        _dbContext.StockTransactions.Remove(exist);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return exist;
    }

    public Task<StockTransaction?> GetStockTransactionByIdAsync(int id, CancellationToken cancellationToken)
        => _dbContext.StockTransactions
            .Include(st => st.InventoryItemId)
            .Include(st => st.TargetLocationId)
            .Where(st => st.Id == id)
            .FirstOrDefaultAsync(cancellationToken);

    public IQueryable<StockTransaction> GetStockTransactions()
        => _dbContext.StockTransactions
            .AsNoTracking()
            .Include(st => st.InventoryItemId)
            .Include(st => st.TargetLocationId);

    public async Task<StockTransaction?> UpdateStockTransactionAsync(StockTransaction stockTransaction, CancellationToken cancellationToken)
    {
        _dbContext.StockTransactions.Update(stockTransaction);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return stockTransaction;
    }
}
