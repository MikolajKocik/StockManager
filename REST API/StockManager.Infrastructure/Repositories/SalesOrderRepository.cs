using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class SalesOrderRepository(StockManagerDbContext db) 
    : BaseOperations<SalesOrder>(db), ISalesOrderRepository
{
    public IQueryable<SalesOrder> GetSalesOrders()
        => GetAll()
            .AsNoTracking()
            .Include(o => o.Customer)
            .Include(x => x.SalesOrderLines)
                .ThenInclude(l => l.Product)
            .AsSplitQuery();

    public async Task<SalesOrder?> GetSalesOrderByIdAsync(int id, CancellationToken ct)
        => await _db.SalesOrders
            .Include(x => x.SalesOrderLines)  
            .AsSplitQuery()
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id, ct);

    public void AddSalesOrder(SalesOrder salesOrder)
        => Add(salesOrder);

    public async Task DeleteSalesOrderAsync(int id, CancellationToken ct)
    {
        SalesOrder order = await _db.SalesOrders.FindAsync([id], ct) 
            ?? throw new InvalidOperationException($"Sales order with id {id} not found.");
        Delete(order);
    }
}
