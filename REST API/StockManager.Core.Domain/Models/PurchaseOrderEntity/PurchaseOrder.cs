using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Core.Domain.Models.PurchaseOrderEntity;

public sealed partial class PurchaseOrder
{
    public int Id { get; private set; }
    public int SupplierId { get; private set; }
    public DateTime OrderDate { get; private set; }
    public DateTime? ExpectedDate { get; private set; }
    public PurchaseOrderStatus Status { get; private set; }

    private readonly List<PurchaseOrderLine> _lines = new();
    public IReadOnlyCollection<PurchaseOrderLine> Lines => _lines;
    private PurchaseOrder() { }

    public PurchaseOrder(int supplierId, DateTime orderDate)
    {
        if (supplierId <= 0)
        {
            throw new ArgumentException("Invalid SupplierId", nameof(supplierId));
        }

        if (orderDate.Date > DateTime.UtcNow.Date)
        {
            throw new ArgumentException("OrderDate cannot be in the future", nameof(orderDate));
        }

        SupplierId = supplierId;
        OrderDate = orderDate.Date;
        Status = PurchaseOrderStatus.Draft;
    }
}
