using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IInvoiceRepository
{
    IQueryable<Invoice> GetInvoices();
    Task<Invoice?> GetInvoiceByIdAsync(int id, CancellationToken cancellationToken);
    Task<Invoice> AddInvoiceAsync(Invoice entity, CancellationToken cancellationToken);
    Task<Invoice> UpdateInvoiceAsync(Invoice entity, CancellationToken cancellationToken);
}
