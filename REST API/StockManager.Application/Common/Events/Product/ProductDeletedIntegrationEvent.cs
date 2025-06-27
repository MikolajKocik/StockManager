using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.Events.Product;

public sealed record ProductDeletedIntegrationEvent(
    int ProductId
    ) : IIntegrationEvent;

