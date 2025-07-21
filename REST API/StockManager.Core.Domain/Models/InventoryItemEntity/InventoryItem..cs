using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Core.Domain.Models.InventoryItemEntity;

public sealed partial class InventoryItem : Entity<int>
{
    public Warehouse Warehouse { get; private set; }
    public decimal QuantityOnHand { get; private set; }
    public decimal QuantityReserved { get; private set; }
    public decimal QuantityAvailable =>
        QuantityOnHand - QuantityReserved;

    // relation *-1 with product
    public int ProductId { get; private set; }
    public Product Product { get; private set; }

    // relation *-1 with binLocation
    public int BinLocationId { get; private set; }
    public BinLocation BinLocation { get; private set; }

    // realtion 1-* with stockTransaction
    private readonly List<StockTransaction> _stockTransactions = new();
    public IReadOnlyCollection<StockTransaction> StockTransactions
        => _stockTransactions.AsReadOnly();

    private InventoryItem() : base() { }

    public InventoryItem(
        int id,
        int productId,
        Warehouse warehouse,
        decimal quantityOnHand,
        int binLocationId,
        decimal quantityReserved = 0
        ) : base(id)
    {
        IsValidQuantity(quantityOnHand, quantityReserved);

        Guard.AgainstDefaultValue(productId, binLocationId);
        Guard.AgainstInvalidEnumValue(warehouse);

        ProductId = productId;
        Warehouse = warehouse;
        QuantityOnHand = quantityOnHand;
        QuantityReserved = quantityReserved;
        BinLocationId = binLocationId;
    }

    public InventoryItem(
     int productId,
     Warehouse warehouse,
     decimal quantityOnHand,
     int binLocationId,
     decimal quantityReserved = 0
     ) : base()
    {
        IsValidQuantity(quantityOnHand, quantityReserved);

        Guard.AgainstDefaultValue(productId, binLocationId);
        Guard.AgainstInvalidEnumValue(warehouse);

        ProductId = productId;
        Warehouse = warehouse;
        QuantityOnHand = quantityOnHand;
        QuantityReserved = quantityReserved;
        BinLocationId = binLocationId;
    }

    private static void IsValidQuantity(decimal quantityReserved, decimal quantityOnHand)
    {
        if (quantityOnHand < 0)
        {
            throw new ArgumentException("Quantity on hand cannot be negative.", nameof(quantityOnHand));
        }

        if (quantityReserved < 0)
        {
            throw new ArgumentException("Quantity reserved cannot be negative.", nameof(quantityReserved));
        }

        if (quantityReserved > quantityOnHand)
        {
            throw new ArgumentException("Reserved quantity cannot be greater than on-hand quantity.");
        }
    }
}
