using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.SalesOrderLineEntity;

public sealed class SalesOrderLine
{
    public int Id { get; private set; }
    public int SalesOrderId { get; private set; }
    public SalesOrder SalesOrder { get; private set; }

    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    public decimal Quantity { get; private set; }
    public UnitOfMeasure UoM { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal LineTotal => Quantity * UnitPrice;

    private SalesOrderLine() { }
    internal SalesOrderLine(SalesOrder order, int productId, decimal qty, decimal price, UnitOfMeasure unit)
    {
        if (qty <= 0)
        {
            throw new ArgumentException("Quantity must be positive value");
        }

        if (price < 0)
        {
            throw new ArgumentException("Price cannot be negative value");
        }

        SalesOrder = order;
        SalesOrderId = order.Id;
        ProductId = productId;
        Quantity = qty;
        UnitPrice = price;
        UoM = unit;
    }
}
