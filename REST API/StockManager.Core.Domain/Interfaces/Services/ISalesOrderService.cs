using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface ISalesOrderService
{
    void AddLine(SalesOrder order, int productId, decimal qty, decimal price, UnitOfMeasure unit);
    void Confirm(SalesOrder order);
    void Ship(SalesOrder order, DateTime shipDate);
    void Deliver(SalesOrder order, DateTime deliveredDate);
    void Cancel(SalesOrder order);
}
