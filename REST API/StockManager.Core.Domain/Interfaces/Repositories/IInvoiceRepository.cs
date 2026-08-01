using StockManager.Core.Domain.Models.InvoiceEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IInvoiceRepository : IBaseRepository
{
    IQueryable<Invoice> GetInvoices();
    Task<Invoice?> GetInvoiceByIdAsync(int id, CancellationToken ct = default);
    void AddInvoice(Invoice invoice);
}
