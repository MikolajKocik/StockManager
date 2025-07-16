using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.InvoiceEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IInvoiceService
{
    void Issue(Invoice invoice);
    void Pay(Invoice invoice, DateTime paymentDate);
    void Cancel(Invoice invoice);
}
