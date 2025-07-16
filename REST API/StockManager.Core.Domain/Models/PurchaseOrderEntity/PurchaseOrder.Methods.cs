using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Core.Domain.Models.PurchaseOrderEntity;

public sealed partial class PurchaseOrder
{
    public void SetExpectedDate(DateTime expected)
    {
        if (expected.Date < OrderDate)
        {
            throw new ArgumentException("ExpectedDate cannot be before OrderDate", nameof(expected));
        }

        ExpectedDate = expected.Date;
    }

    public void AddLine(PurchaseOrderLine line)
    {
        if (Status != PurchaseOrderStatus.Draft)
        {
            throw new InvalidOperationException("Cannot add lines unless Draft");
        }

        _lines.Add(line);
    }

    public void Confirm()
    {
        if (!_lines.Any())
        {
            throw new InvalidOperationException("Must have at least one line");
        }

        Status = PurchaseOrderStatus.Submitted;
    }
}
