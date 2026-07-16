using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IInvoiceRepository
{
    IQueryable<Invoice> GetInvoices();
    Task<Invoice?> GetInvoiceByIdAsync(int id, CancellationToken ct = default);
    void AddInvoice(Invoice invoice);
}
