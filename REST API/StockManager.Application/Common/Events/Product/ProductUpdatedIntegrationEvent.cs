using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.Events.Product;

public sealed record ProductUpdatedIntegrationEvent(
    int ProductId,
    string NewName,
    Guid? SupplierId
    ) : IIntegrationEvent;

