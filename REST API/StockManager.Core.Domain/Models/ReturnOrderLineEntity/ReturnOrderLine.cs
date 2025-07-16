using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;

namespace StockManager.Core.Domain.Models.ReturnOrderLineEntity;

public sealed class ReturnOrderLine
{
    public int Id { get; private set; }
    public int ReturnOrderId { get; private set; }
    public ReturnOrder ReturnOrder { get; private set; }

    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    public decimal Quantity { get; private set; }
    public UnitOfMeasure UoM { get; private set; }

    private ReturnOrderLine() { }

    internal ReturnOrderLine(
       int returnOrderId,
       int productId,
       decimal quantity,
       UnitOfMeasure uom
        )
    {
        if (returnOrderId <= 0)
        {
            throw new ArgumentException(null, nameof(returnOrderId));
        }

        if (productId <= 0)
        {
            throw new ArgumentException(null, nameof(productId));
        }

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero", nameof(quantity));
        }

        ReturnOrderId = returnOrderId;
        ProductId = productId;
        Quantity = quantity;
        UoM = uom;
    }
}
