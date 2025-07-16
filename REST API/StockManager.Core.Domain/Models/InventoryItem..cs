using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;

namespace StockManager.Core.Domain.Models;

public sealed class InventoryItem
{
    public int Id { get; private set; }
    public int ProductId { get; }
    public Warehouse Warehouse { get; set; }
    public decimal QuantityOnHand { get; set; }
    public decimal QuantityReserved { get; set; }
    public decimal QuantityAvailable =>
        QuantityOnHand - QuantityReserved;

    private InventoryItem() { }

    public InventoryItem(
        int id,
        int productId,
        Warehouse warehouse,
        decimal quantityOnHand,
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

        Id = id;
        ProductId = productId;
        Warehouse = warehouse;
        QuantityOnHand = quantityOnHand;
        QuantityReserved = quantityReserved;
    }
}
