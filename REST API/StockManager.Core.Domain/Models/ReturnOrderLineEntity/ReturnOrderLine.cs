using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.ReturnOrderEntity;

namespace StockManager.Core.Domain.Models.ReturnOrderLineEntity;

public sealed class ReturnOrderLine : Entity<int>
{
    public int ReturnOrderId { get; private set; }
    public ReturnOrder ReturnOrder { get; private set; }
    public decimal Quantity { get; private set; }
    public UnitOfMeasure UoM { get; private set; }

    // relation *-1 with product
    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    private ReturnOrderLine() : base() { }

    internal ReturnOrderLine(
        int returnOrderId,
        int productId,
        decimal quantity,
        UnitOfMeasure uom
        ) : base()
    {
        Guard.AgainstDefaultValue(returnOrderId, productId);
        Guard.AgainstInvalidEnumValue(uom);
        Guard.DecimalValueGreaterThanZero(quantity);

        ReturnOrderId = returnOrderId;
        ProductId = productId;
        Quantity = quantity;
        UoM = uom;
    }

    internal ReturnOrderLine(
        int id,
        int returnOrderId,
        int productId,
        decimal quantity,
        UnitOfMeasure uom
       ) : base(id)
    {
        Guard.AgainstDefaultValue(returnOrderId, productId);
        Guard.AgainstInvalidEnumValue(uom);
        Guard.DecimalValueGreaterThanZero(quantity);

        ReturnOrderId = returnOrderId;
        ProductId = productId;
        Quantity = quantity;
        UoM = uom;
    }
}
