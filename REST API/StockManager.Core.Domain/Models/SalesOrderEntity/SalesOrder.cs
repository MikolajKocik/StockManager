using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Core.Domain.Models.SalesOrderLineEntity;

namespace StockManager.Core.Domain.Models.SalesOrderEntity;

public sealed partial class SalesOrder
{
    public int Id { get; private set; }
    public int CustomerId { get; private set; }
    public Customer Customer { get; private set; }

    public DateTime OrderDate { get; private set; }
    public DateTime? ShipDate { get; private set; }
    public DateTime? DeliveredDate { get; private set; }
    public DateTime? CancelDate { get; private set; }

    public SalesOrderStatus Status { get; private set; }

    private readonly List<SalesOrderLine> _lines = new();
    public IReadOnlyList<SalesOrderLine> Lines => _lines;

    private SalesOrder() { }
    public SalesOrder(int customerId, DateTime orderDate)
    {
        if (customerId <= 0)
        {
            throw new ArgumentException("Not valid customer");
        }

        if (orderDate > DateTime.UtcNow)
        {
            throw new ArgumentException("Future order date");
        }

        CustomerId = customerId;
        OrderDate = orderDate;
        Status = SalesOrderStatus.Draft;
    }
}
