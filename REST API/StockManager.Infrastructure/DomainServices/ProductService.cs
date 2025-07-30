using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class ProductService : IProductService
{
    public void SetAsDeleted(Product product)
        => product.SetAsDeleted();

    public void SetProductToInventoryItem(Product product, InventoryItem inventoryItem)
        => product.SetProductToInventoryItem(inventoryItem);
    public void SetSupplier(Product product, Supplier newSupplier)
        => product.SetSupplier(newSupplier);

    // reimplementation - hidden method for test
    void IProductService.SetExpirationDateForTest(Product product)
        => product.SetExpirationDateForTest(product);   
}
