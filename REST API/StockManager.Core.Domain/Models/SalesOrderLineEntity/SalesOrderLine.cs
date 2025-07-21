using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.SalesOrderLineEntity;

public sealed class SalesOrderLine : Entity<int>
{
    public decimal Quantity { get; private set; }
    public UnitOfMeasure UoM { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal LineTotal => Quantity * UnitPrice;

    // relation *-1 with product
    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    // relation *-1 with salesOrder
    public int SalesOrderId { get; private set; }
    public SalesOrder SalesOrder { get; private set; }


    private SalesOrderLine() : base() { }

    internal SalesOrderLine(
        int salesOrderId,
        int productId,
        decimal qty,
        decimal price,
        UnitOfMeasure unit
        ) : base() 
    {
        Guard.AgainstDefaultValue(salesOrderId, productId);
        Guard.DecimalValueGreaterThanZero(qty, price);
        Guard.AgainstInvalidEnumValue(unit);

        SalesOrderId = salesOrderId;
        ProductId = productId;
        Quantity = qty;
        UnitPrice = price;
        UoM = unit;
    }

    internal SalesOrderLine(
        int id,
        int salesOrderId,
        int productId,
        decimal qty,
        decimal price,
        UnitOfMeasure unit
       ) : base(id)
    {
        Guard.AgainstDefaultValue(salesOrderId, productId);
        Guard.DecimalValueGreaterThanZero(qty, price);
        Guard.AgainstInvalidEnumValue(unit);

        SalesOrderId = salesOrderId;
        ProductId = productId;
        Quantity = qty;
        UnitPrice = price;
        UoM = unit;
    }
}
