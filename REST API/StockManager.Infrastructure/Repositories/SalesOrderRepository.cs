using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public sealed class SalesOrderRepository : ISalesOrderRepository
{
    private readonly StockManagerDbContext _dbContext;

    public SalesOrderRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<SalesOrder> GetSalesOrders()
        => _dbContext.SalesOrders.AsQueryable();

    public async Task<SalesOrder?> GetSalesOrderByIdAsync(int id, CancellationToken cancellationToken)
        => await _dbContext.SalesOrders
            .Include(x => x.SalesOrderLines)  
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<SalesOrder> AddSalesOrderAsync(SalesOrder salesOrder, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, salesOrder, cancellationToken);

    public async Task<SalesOrder> UpdateSalesOrderAsync(SalesOrder salesOrder, CancellationToken cancellationToken)
    {
        if (_dbContext.Entry(salesOrder).State == EntityState.Detached)
        {
            _dbContext.SalesOrders.Attach(salesOrder);
            _dbContext.Entry(salesOrder).State = EntityState.Modified;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return salesOrder;
    }

    public async Task<SalesOrder> DeleteSalesOrderAsync(SalesOrder salesOrder, CancellationToken cancellationToken)
    {
        _dbContext.SalesOrders.Remove(salesOrder);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return salesOrder;
    }
    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
         => Task.FromResult(_dbContext.Database.BeginTransaction());
}
