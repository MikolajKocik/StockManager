using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.Common.Events.Product;

public sealed class ProductAddedIntegrationEvent : IIntegrationEvent
{
    public int ProductId { get; }
    public string Name { get; }
    public Guid SupplierId { get; }

    public ProductAddedIntegrationEvent(int productId, string name, Guid supplierId)
    {
        ProductId = productId;
        Name = name;
        SupplierId = supplierId;
    }
}
