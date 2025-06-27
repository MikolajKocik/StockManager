using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.Events.Supplier;

public sealed record SupplierDeletedIntegrationEvent(
       Guid SupplierId
   ) : IIntegrationEvent;
