using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;

namespace StockManager.Core.Domain.Models.InvoiceEntity;

public sealed partial class Invoice
{
    public void Issue()
    {
        if (Status != InvoiceStatus.Draft)
        {
            throw new InvalidOperationException("Only Draft can be issued");
        }

        Status = InvoiceStatus.Issued;
    }

    public void Pay(DateTime paymentDate)
    {
        if (Status != InvoiceStatus.Issued)
        {
            throw new InvalidOperationException("Only Issued can be paid");
        }

        Status = InvoiceStatus.Paid;
    }

    public void Cancel()
    {
        if (Status == InvoiceStatus.Paid)
        {
            throw new InvalidOperationException("Cannot cancel a paid invoice");
        }

        Status = InvoiceStatus.Cancelled;
    }
}
