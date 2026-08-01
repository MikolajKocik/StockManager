using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class InventoryItemRepository(StockManagerDbContext db) 
    : BaseOperations<InventoryItem>(db), IInventoryItemRepository
{
    public async Task<InventoryItem?> GetInventoryItemByIdAsync(int id, CancellationToken ct)
         => await _db.InventoryItems
                .Include(i => i.Product)
                .Include(i => i.BinLocation)
                .FirstOrDefaultAsync(i => i.Id == id, ct);

    public IQueryable<InventoryItem> GetInventoryItems()
        => GetAll()
            .IgnoreQueryFilters()
            .Include(i => i.Product)
            .Include(i => i.BinLocation)
            .AsNoTracking();

    public void AddInventoryItem(InventoryItem inventoryItem)
        =>  Add(inventoryItem);

    public async Task<BinLocation?> GetBinLocationByIdAsync(int binLocationId, CancellationToken ct)
        => await _db.BinLocations
            .AsNoTracking()
            .FirstOrDefaultAsync(bl => bl.Id == binLocationId, ct);

    public async Task<IReadOnlyList<InventoryItem>> GetInventoryItemsByProductIdAsync(int productId, CancellationToken ct)
        => await _db.InventoryItems
            .Where(i => i.ProductId == productId)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task DeleteInventoryItemAsync(int id , CancellationToken ct)
    {
        InventoryItem item = await _db.FindAsync<InventoryItem>([id], ct)
            ?? throw new InvalidOperationException($"Inventory item with ID {id} not found.");
        _db.Remove(item);
    }
}
