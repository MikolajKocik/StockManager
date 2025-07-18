using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Infrastructure.DomainServices;

public sealed class InventoryItemService : IInventoryItemService
{
    public void AssignToBinLocation(InventoryItem item, int newBinLocationId)
        => item.AssignToBinLocation(newBinLocationId);

    public void DecreaseQuantity(InventoryItem item, decimal amount)
        => item.DecreaseQuantity(amount);

    public void IncreaseQuantity(InventoryItem item, decimal amount)
        => item.IncreaseQuantity(amount);

    public void ReleaseQuantity(InventoryItem item, decimal amount)
        => item.ReleaseQuantity(amount);

    public void ReserveQuantity(InventoryItem item, decimal amount)
        => item.ReserveQuantity(amount);
}
