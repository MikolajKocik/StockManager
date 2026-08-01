using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class InvoiceRepository(StockManagerDbContext db) 
    : BaseOperations<Invoice>(db), IInvoiceRepository
{
    public IQueryable<Invoice> GetInvoices() 
        => GetAll()
            .AsNoTracking();
  
    public async Task<Invoice?> GetInvoiceByIdAsync(int id, CancellationToken ct)
        => await _db.Invoices
                .Where(x => x.Id == id)
                .Include(x => x.PurchaseOrderId)
                .Include(x => x.SalesOrderId)
                .FirstOrDefaultAsync(ct);

    public void AddInvoice(Invoice invoice)
        => Add(invoice);
}
