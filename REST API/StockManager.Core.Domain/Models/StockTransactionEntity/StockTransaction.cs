using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;

namespace StockManager.Core.Domain.Models.StockTransactionEntity;

public sealed class StockTransaction
{
    public int Id { get; private set; }
    public int InventoryItemId { get; private set; }
    public TransactionType Type { get; private set; }
    public decimal Quantity { get; private set; }
    public DateTime Date { get; private set; }
    public int? SourceLocationId { get; private set; }
    public int? TargetLocationId { get; private set; }
    public string ReferenceNumber { get; private set; }

    private StockTransaction() { }

    public StockTransaction(
       int inventoryItemId,
       TransactionType type,
       decimal quantity,
       DateTime date,
       string referenceNumber,
       int? sourceLocationId = null,
       int? targetLocationId = null)
    {
        if (inventoryItemId <= 0)
        {
            throw new ArgumentException("Invalid InventoryItemId", nameof(inventoryItemId));
        }

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be > 0", nameof(quantity));
        }

        if (date > DateTime.UtcNow)
        {
            throw new ArgumentException("Date cannot be in the future", nameof(date));
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(referenceNumber, nameof(referenceNumber));

        InventoryItemId = inventoryItemId;
        Type = type;
        Quantity = quantity;
        Date = date;
        ReferenceNumber = referenceNumber;
        SourceLocationId = sourceLocationId;
        TargetLocationId = targetLocationId;
    }
}
