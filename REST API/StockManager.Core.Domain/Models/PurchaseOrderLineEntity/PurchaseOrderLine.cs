using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

public sealed class PurchaseOrderLine
{
    public int Id { get; private set; }
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

    private PurchaseOrderLine() { }

    internal PurchaseOrderLine(
        int purchaseOrderId,
        Product product,
        int productId,
        decimal quantity,
        UnitOfMeasure uom,
        decimal unitPrice,
        PurchaseOrder purchaseOrder
        )
    {
        if (purchaseOrderId <= 0)
        {
            throw new ArgumentException("Invalid PurchaseOrderId", nameof(purchaseOrderId));
        }

        if (productId <= 0)
        {
            throw new ArgumentException("Invalid ProductId", nameof(productId));
        }

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero", nameof(quantity));
        }

        if (unitPrice < 0)
        {
            throw new ArgumentException("UnitPrice cannot be negative", nameof(unitPrice));
        }

        ArgumentException.ThrowIfNullOrEmpty("Product is required", nameof(product));
        ArgumentException.ThrowIfNullOrEmpty("PurchaseOrder is required", nameof(purchaseOrder));

        PurchaseOrderId = purchaseOrderId;
        Product = product;
        ProductId = productId;
        Quantity = quantity;
        UoM = uom;
        UnitPrice = unitPrice;
        PurchaseOrder = purchaseOrder;
    }
}
