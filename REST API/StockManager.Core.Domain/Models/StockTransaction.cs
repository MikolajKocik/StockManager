using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;

namespace StockManager.Core.Domain.Models;

public sealed class StockTransaction
{
    public int Id { get; private set; }
    public int InventoryItemId { get; }
    public TransactionType Type { get; set; }
    public decimal Quantity { get; set; }
    public DateTime Date { get; set; }
    public int? SourceLocationId { get; set; }
    public int? TargetLocationId { get; set; }
    public string ReferenceNumber { get; set; }
}
