using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.GuardMethods;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Models.ProductEntity;

public sealed partial class Product
{
    public void SetSupplier(Supplier newSupplier)
    {
        Guard.AgainstNull(newSupplier);

        Supplier = newSupplier;
    }

    public void SetProductToInventoryItem(InventoryItem inventoryItem)
    {
        Guard.AgainstNull(inventoryItem);
        Id = inventoryItem.Id;
    }

    public void SetAsDeleted()
    {
        if (IsDeleted == true)
        {
            return;
        }

        IsDeleted = true;
    }
}
