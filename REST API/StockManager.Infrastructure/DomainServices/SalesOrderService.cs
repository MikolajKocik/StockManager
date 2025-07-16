using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class SalesOrderService : ISalesOrderService
{
    public void AddLine(SalesOrder order, int productId, decimal qty, decimal price)
        => order.AddLine(productId, qty, price);

    public void Confirm(SalesOrder order) => order.Confirm();

    public void Ship(SalesOrder order, DateTime shipDate)
        => order.Ship(shipDate);
}
