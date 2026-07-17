using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IInventoryItemRepository : IBaseRepository
{
    IQueryable<InventoryItem> GetInventoryItems();
    Task<InventoryItem?> GetInventoryItemByIdAsync(int id, CancellationToken ct = default);
    void AddInventoryItem(InventoryItem inventoryItem);
    Task<BinLocation?> GetBinLocationByIdAsync(int binLocationId, CancellationToken ct = default);
    Task<IReadOnlyList<InventoryItem>> GetInventoryItemsByProductIdAsync(int productId, CancellationToken ct = default);
    Task DeleteInventoryItemAsync(int id, CancellationToken ct = default);
}
