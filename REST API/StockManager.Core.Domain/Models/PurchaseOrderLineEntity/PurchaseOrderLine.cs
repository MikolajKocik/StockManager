using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Common;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

public sealed class PurchaseOrderLine : Entity<int>
{
    public decimal Quantity { get; private set; }
    public UnitOfMeasure UoM { get; private set; }        
    public decimal UnitPrice { get; private set; }
    public decimal LineTotal => Quantity * UnitPrice;

    // realtion *-1 with product
    public Product Product { get; private set; }
    public int ProductId { get; private set; }

    // relation *-1 with purchaseOrder
    public PurchaseOrder PurchaseOrder { get; private set; }
    public int PurchaseOrderId { get; private set; }

    private PurchaseOrderLine() : base() { }

    internal PurchaseOrderLine(
        int id,
        int purchaseOrderId,
        int productId,
        decimal quantity,
        UnitOfMeasure uom,
        decimal unitPrice
        ) : base(id)
    {
        Guard.AgainstDefaultValue(purchaseOrderId, productId);
        Guard.AgainstInvalidEnumValue(uom);

        ValidateLineQuantitiesAndPrice(quantity, unitPrice);

        PurchaseOrderId = purchaseOrderId;
        ProductId = productId;
        Quantity = quantity;
        UoM = uom;
        UnitPrice = unitPrice;
    }
    internal PurchaseOrderLine(
      int purchaseOrderId,
      int productId,
      decimal quantity,
      UnitOfMeasure uom,
      decimal unitPrice
      ) : base()
    {
        Guard.AgainstDefaultValue(purchaseOrderId, productId);
        Guard.AgainstInvalidEnumValue(uom);

        ValidateLineQuantitiesAndPrice(quantity, unitPrice);

        PurchaseOrderId = purchaseOrderId;
        ProductId = productId;
        Quantity = quantity;
        UoM = uom;
        UnitPrice = unitPrice;
    }

    private  void ValidateLineQuantitiesAndPrice(decimal quantity, decimal unitPrice)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be positive.", nameof(quantity));
        }

        if (unitPrice < 0)
        {
            throw new ArgumentException("Unit price cannot be negative.", nameof(unitPrice));
        }
    }
}
