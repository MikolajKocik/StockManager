using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public class PurchaseOrderRepository : IPurchaseOrderRepository
{
    private readonly StockManagerDbContext _dbContext;

    public PurchaseOrderRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PurchaseOrder> AddPurchaseOrderAsync(PurchaseOrder purchaseOrder, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, purchaseOrder, cancellationToken);

    public async Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(int id, CancellationToken cancellationToken)
        => await _dbContext.PurchaseOrders.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    

    public async Task<PurchaseOrder> UpdatePurchaseOrderAsync(PurchaseOrder purchaseOrder, CancellationToken cancellationToken)
    {
        _dbContext.PurchaseOrders.Update(purchaseOrder);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return purchaseOrder;
    }

    public async Task<PurchaseOrder> DeletePurchaseOrderAsync(PurchaseOrder purchaseOrder, CancellationToken cancellationToken)
    {
        PurchaseOrder purchaseOrderExist = await RepositoryQueriesHelpers.EntityFindAsync<PurchaseOrder, int>(_dbContext, purchaseOrder.Id, cancellationToken);

        _dbContext.PurchaseOrders.Remove(purchaseOrderExist!);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return purchaseOrderExist;
    }
}
