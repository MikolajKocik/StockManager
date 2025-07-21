using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;

namespace StockManager.Core.Domain.Models.ReturnOrderEntity;

public sealed partial class ReturnOrder
{
    public void AddLine(ReturnOrderLine line)
    {
        Guard.AgainstNull(line);

        if (Status != ReturnOrderStatus.Draft)
        {
            throw new InvalidOperationException("Cannot add lines once not Draft");
        }

        _returnOrderlines.Add(line);
    }

    public void Confirm()
    {
        if (!_returnOrderlines.Any())
        {
            throw new InvalidOperationException("Must have at least one line");
        }

        Status = ReturnOrderStatus.Confirmed;
    }

    public void Complete()
    {
        if (Status != ReturnOrderStatus.Confirmed)
        {
            throw new InvalidOperationException("Can only complete a Confirmed return");
        }

        Status = ReturnOrderStatus.Completed;
    }
}
