using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class InvoiceService : IInvoiceService
{
    public void Cancel(Invoice invoice)
        => invoice.Cancel();
    public void Issue(Invoice invoice)
        => invoice.Issue();
    public void Pay(Invoice invoice, DateTime paymentDate)
        => invoice.Pay(paymentDate);
}
