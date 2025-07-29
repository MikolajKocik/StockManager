using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Helpers;

namespace StockManager.Infrastructure.Repositories;

public sealed class InvoiceRepository : IInvoiceRepository
{
    private readonly StockManagerDbContext _dbContext;

    public InvoiceRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<Invoice> GetInvoices() => _dbContext.Invoices.AsQueryable();
  
    public async Task<Invoice?> GetInvoiceByIdAsync(int id, CancellationToken cancellationToken)
        => await _dbContext.Invoices
                .Where(x => x.Id == id)
                .Include(x => x.PurchaseOrderId)
                .Include(x => x.SalesOrderId)
                .FirstOrDefaultAsync(cancellationToken);  
    
    public async Task<Invoice> AddInvoiceAsync(Invoice entity, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, entity, cancellationToken);

    public async Task<Invoice> UpdateInvoiceAsync(Invoice entity, CancellationToken ct = default)
    {
        if (_dbContext.Entry(entity).State == EntityState.Detached)
        {
            _dbContext.Invoices.Attach(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        await _dbContext.SaveChangesAsync(ct);
        return entity;
    }
}
