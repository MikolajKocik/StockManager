using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;

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

    private InventoryItem() { }

    public InventoryItem(
        int productId,
        Warehouse warehouse,
        decimal quantityOnHand,
        Product product,
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

        ProductId = productId;
        Product = product;
        Warehouse = warehouse;
        QuantityOnHand = quantityOnHand;
        QuantityReserved = quantityReserved;
    }
}
