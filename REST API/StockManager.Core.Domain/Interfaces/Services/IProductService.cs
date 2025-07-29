using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IProductService
{
    void SetSupplier(Product product, Supplier newSupplier);
    void SetProductToInventoryItem(Product product, InventoryItem inventoryItem);
}
