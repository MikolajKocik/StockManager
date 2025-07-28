using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Helpers;

namespace StockManager.Infrastructure.Repositories;
public sealed class InventoryItemRepository : IInventoryItemRepository
{
    private readonly StockManagerDbContext _dbContext;
    public InventoryItemRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Asynchronously retrieves an inventory item by its unique identifier.
    /// </summary>
    /// <remarks>The method includes related <see cref="Product"/> and <see cref="BinLocation"/> entities  in
    /// the result. Ensure the <paramref name="cancellationToken"/> is properly managed to  handle operation
    /// cancellation.</remarks>
    /// <param name="id">The unique identifier of the inventory item to retrieve.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the  <see cref="InventoryItem"/> if
    /// found; otherwise, <see langword="null"/>.</returns>
    public Task<InventoryItem?> GetInventoryItemByIdAsync(int id, CancellationToken cancellationToken)
         => _dbContext.InventoryItems
                .Include(i => i.Product)
                .Include(i => i.BinLocation)
                .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    /// <summary>
    /// Retrieves a queryable collection of inventory items with related product and bin location data.
    /// </summary>
    /// <remarks>The returned collection includes related data from the Product and BinLocation entities. The
    /// query is executed with no tracking, which improves performance for read-only operations.</remarks>
    /// <returns>An <see cref="IQueryable{T}"/> of <see cref="InventoryItem"/> representing the inventory items.</returns>
    public IQueryable<InventoryItem> GetInventoryItems()
        => _dbContext.InventoryItems
                .Include(i => i.Product)
                .Include(i => i.BinLocation)
                .AsNoTracking();

    /// <summary>
    /// Asynchronously adds a new inventory item to the database.
    /// </summary>
    /// <remarks>This method saves the changes to the database and returns the added inventory item.</remarks>
    /// <param name="inventoryItem">The inventory item to add. Cannot be null.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The added <see cref="InventoryItem"/> instance.</returns>
    public async Task<InventoryItem> AddInventoryItemAsync(InventoryItem inventoryItem, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(inventoryItem, _dbContext, cancellationToken);

    /// <summary>
    /// Updates the specified inventory item in the database asynchronously.
    /// </summary>
    /// <param name="inventoryItem">The inventory item to update. Must not be null and should have a valid identifier.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The updated <see cref="InventoryItem"/> instance.</returns>
    public async Task<InventoryItem> UpdateInventoryItemAsync(InventoryItem inventoryItem, CancellationToken cancellationToken)
    {
        _dbContext.InventoryItems.Update(inventoryItem);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return inventoryItem;
    }

    /// <summary>
    /// Begins a new database transaction asynchronously.
    /// </summary>
    /// <remarks>Use this method to start a transaction when performing multiple operations that need to be
    /// executed atomically. Ensure to commit or roll back the transaction to release resources.</remarks>
    /// <param name="cancellationToken">A token to monitor for cancellation requests. The operation is canceled if the token is triggered.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains an <see
    /// cref="IDbContextTransaction"/> representing the new transaction.</returns>
    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
        => _dbContext.Database.BeginTransactionAsync(cancellationToken);

    /// <summary>
    /// Asynchronously retrieves a <see cref="BinLocation"/> by its unique identifier.
    /// </summary>
    /// <param name="binLocationId">The unique identifier of the bin location to retrieve.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="BinLocation"/> if
    /// found; otherwise, <see langword="null"/>.</returns>
    public async Task<BinLocation> GetBinLocationByIdAsync(int binLocationId, CancellationToken cancellationToken)
        => await _dbContext.BinLocations
            .FirstOrDefaultAsync(bl => bl.Id == binLocationId, cancellationToken);

    /// <summary>
    /// Asynchronously deletes the specified inventory item from the database.
    /// </summary>
    /// <param name="inventoryItem"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public async Task<InventoryItem?> DeleteInventoryItemAsync(InventoryItem inventoryItem, CancellationToken cancellationToken)
    {
        InventoryItem inventoryItemExist = await RepositoryQueriesHelpers.EntityFindAsync<InventoryItem, int>(inventoryItem.Id, _dbContext, cancellationToken);

        _dbContext.InventoryItems.Remove(inventoryItemExist!);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return inventoryItem;
    }
}
