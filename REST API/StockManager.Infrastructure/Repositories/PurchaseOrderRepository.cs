using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class PurchaseOrderRepository(StockManagerDbContext db) 
    : BaseOperations<PurchaseOrder>(db), IPurchaseOrderRepository
{
    public IQueryable<PurchaseOrder> GetPurchaseOrders()
        => GetAll()
            .Include(o => o.Supplier)
            .Include(o => o.PurchaseOrderLines)
                .ThenInclude(l => l.Product)
            .AsSplitQuery()
            .AsNoTracking();

    public void AddPurchaseOrder(PurchaseOrder purchaseOrder)
        => Add(purchaseOrder);

    public async Task<PurchaseOrder?> GetPurchaseOrderByIdAsync(int id, CancellationToken ct)
        => await _db.PurchaseOrders
            .Include(o => o.Supplier)
            .Include(o => o.PurchaseOrderLines)
                .ThenInclude(l => l.Product)
            .SingleOrDefaultAsync(x => x.Id == id, ct);

    public async Task DeletePurchaseOrder(int id, CancellationToken ct)
    {
        PurchaseOrder order = await _db.PurchaseOrders.FindAsync([id], ct)
            ?? throw new InvalidOperationException($"Purchase order with ID {id} not found.");
        Delete(order);
    }
}
