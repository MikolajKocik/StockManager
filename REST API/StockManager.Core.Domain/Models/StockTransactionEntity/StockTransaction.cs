using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Core.Domain.Models.StockTransactionEntity;

public sealed class StockTransaction : Entity<int>
{
    public TransactionType Type { get; private set; }
    public decimal Quantity { get; private set; }
    public DateTime Date { get; private set; }
    public int? SourceLocationId { get; private set; }
    public int? TargetLocationId { get; private set; }
    public string ReferenceNumber { get; private set; }

    // relation *-1 with inventoryItem
    public InventoryItem InventoryItem { get; private set; }
    public int InventoryItemId { get; private set; }

    private StockTransaction() : base() { }

    public StockTransaction(
        int id,
        int inventoryItemId,
        TransactionType type,
        decimal quantity,
        DateTime date,
        string referenceNumber,
        int? sourceLocationId = null,
        int? targetLocationId = null
        ) : base (id)
    {
        Guard.AgainstDefaultValue(inventoryItemId);
        Guard.AgainstDefaultValueIfProvided(sourceLocationId, nameof(sourceLocationId));
        Guard.AgainstDefaultValueIfProvided(targetLocationId, nameof(targetLocationId));
        Guard.DecimalValueGreaterThanZero(quantity);
        Guard.IsValidDate(date, nameof(date));
        Guard.AgainstNullOrWhiteSpace(referenceNumber);
        Guard.AgainstInvalidEnumValue(type);

        InventoryItemId = inventoryItemId;
        Type = type;
        Quantity = quantity;
        Date = date;
        ReferenceNumber = referenceNumber;
        SourceLocationId = sourceLocationId;
        TargetLocationId = targetLocationId;
    }

    public StockTransaction(
        int inventoryItemId,
        TransactionType type,
        decimal quantity,
        DateTime date,
        string referenceNumber,
        int? sourceLocationId = null,
        int? targetLocationId = null
        ) : base() 
    {
        Guard.AgainstDefaultValue(inventoryItemId);
        Guard.AgainstDefaultValueIfProvided(sourceLocationId, nameof(sourceLocationId));
        Guard.AgainstDefaultValueIfProvided(targetLocationId, nameof(targetLocationId));
        Guard.DecimalValueGreaterThanZero(quantity);
        Guard.IsValidDate(date, nameof(date));
        Guard.AgainstNullOrWhiteSpace(referenceNumber);
        Guard.AgainstInvalidEnumValue(type);

        InventoryItemId = inventoryItemId;
        Type = type;
        Quantity = quantity;
        Date = date;
        ReferenceNumber = referenceNumber;
        SourceLocationId = sourceLocationId;
        TargetLocationId = targetLocationId;
    }
}
