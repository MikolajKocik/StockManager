using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IInventoryItemService
{
    void IncreaseQuantity(InventoryItem item, decimal amount);
    void DecreaseQuantity(InventoryItem item, decimal amount);
    void ReserveQuantity(InventoryItem item, decimal amount);
    void ReleaseQuantity(InventoryItem item, decimal amount);
    void AssignToBinLocation(InventoryItem item, int newBinLocationId);
}
