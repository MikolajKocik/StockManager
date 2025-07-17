using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Core.Domain.Models.InventoryItemEntity;

public sealed class InventoryItem
{
    public int Id { get; private set; }
    public Warehouse Warehouse { get; set; }
    public decimal QuantityOnHand { get; set; }
    public decimal QuantityReserved { get; set; }
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

    private InventoryItem() { }

    public InventoryItem(
        int productId,
        Warehouse warehouse,
        decimal quantityOnHand,
        Product product,
        BinLocation binLocation,
        int binLocationId,
        decimal quantityReserved = 0)
    {
        if(QuantityOnHand < 0)
        {
            throw new ArgumentException("Quantity must be positive value");
        }

        if(QuantityReserved < 0)
        {
            throw new ArgumentException("Reserved quantity must be positive value");
        }

        if(QuantityReserved > QuantityOnHand)
        {
            throw new ArgumentException("Reserved quantity cannot be greater than on hand quantity");
        }

        if(productId <= 0)
        {
            throw new ArgumentException(null, nameof(productId));
        }

        if (binLocationId <= 0)
        {
            throw new ArgumentException(null, nameof(binLocationId));
        }

        ProductId = productId;
        Product = product;
        Warehouse = warehouse;
        QuantityOnHand = quantityOnHand;
        QuantityReserved = quantityReserved;
        BinLocation = binLocation;
        BinLocationId = binLocationId;
    }
}
