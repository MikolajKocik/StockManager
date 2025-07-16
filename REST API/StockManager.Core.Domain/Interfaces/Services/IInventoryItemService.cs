using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models;

namespace StockManager.Core.Domain.Interfaces.Services;

public interface IInventoryItemService
{
    void AddStock(InventoryItem item, decimal amount);
    void Reserve(InventoryItem item, decimal amount);
    void ReleaseReservation(InventoryItem item, decimal amount);
    void RemoveStock(InventoryItem item, decimal amount);
}
