using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface IInventoryItemRepository 
{
    IQueryable<InventoryItem> GetInventoryItems();
    Task<InventoryItem?> GetInventoryItemByIdAsync(int id, CancellationToken cancellationToken);
    Task<InventoryItem> AddInventoryItemAsync(InventoryItem inventoryItem, CancellationToken cancellationToken);
    Task<InventoryItem> UpdateInventoryItemAsync(InventoryItem inventoryItem, CancellationToken cancellationToken);
    Task<BinLocation> GetBinLocationByIdAsync(int binLocationId, CancellationToken cancellationToken);
    Task<InventoryItem?> DeleteInventoryItemAsync(InventoryItem inventoryItem, CancellationToken cancellationToken);
}
