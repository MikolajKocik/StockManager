using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.ReturnOrderLineEntity;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Core.Domain.Models.ReturnOrderEntity;

public sealed partial class ReturnOrder
{
    public int Id { get; private set; }
    public ReturnOrderType Type { get; private set; }
    public ReturnOrderStatus Status { get; private set; }

    public int? SalesOrderId { get; private set; }
    public SalesOrder? SalesOrder { get; private set; }

    public int? PurchaseOrderId { get; private set; }
    public PurchaseOrder? PurchaseOrder { get; private set; }

    public DateTime ReturnDate { get; private set; }

    private readonly List<ReturnOrderLine> _lines = new();
    public IReadOnlyCollection<ReturnOrderLine> Lines => _lines;

    public ReturnOrder(ReturnOrderType type, DateTime returnDate)
    {
        Type = type;
        ReturnDate = returnDate.Date;
        Status = ReturnOrderStatus.Draft;
    }
}
