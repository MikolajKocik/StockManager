using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;

namespace StockManager.Core.Domain.Models.SalesOrderEntity;

public sealed partial class SalesOrder
{
    public void AddLine(
        int productId,
        decimal qty,
        decimal price,
        UnitOfMeasure unit
        )
    {
        Guard.DecimalValueGreaterThanZero(qty, price);
        Guard.AgainstInvalidEnumValue(unit);
        Guard.AgainstDefaultValue(productId);

        _salesOrderlines.Add(new SalesOrderLine(Id, productId, qty, price, unit));
    }

    public void Confirm()
    {
        if (!_salesOrderlines.Any())
        {
            throw new InvalidOperationException("Order must have at least one position");
        }

        Status = SalesOrderStatus.Confirmed;
    }

    public void Ship(DateTime shipDate)
    {
        if (Status != SalesOrderStatus.Confirmed)
        {
            throw new InvalidOperationException("Order must be confirmed");
        }

        if (shipDate < OrderDate)
        {
            throw new ArgumentException("Shipment data cannot be before order data");
        }

        Status = SalesOrderStatus.Shipped;
    }

    public void Deliver(DateTime deliveredDate)
    {
        if (Status != SalesOrderStatus.Shipped)
        {
            throw new InvalidOperationException("Your order must be shipped to be delivered");
        }

        if (deliveredDate.Date < ShipDate?.Date)
        {
            throw new ArgumentException("The delivery date cannot be before the shipping date");
        }

        DeliveredDate = deliveredDate;
        Status = SalesOrderStatus.Delivered;
    }

    public void Cancel()
    {
        if (Status == SalesOrderStatus.Shipped || Status == SalesOrderStatus.Delivered)
        {
            throw new InvalidOperationException("You cannot cancel an order that has already been shipped or delivered");
        }

        Status = SalesOrderStatus.Cancelled;
    }
}
