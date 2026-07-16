using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class WarehouseOperationRepository(StockManagerDbContext db) 
    : BaseOperations<WarehouseOperation>(db), IWarehouseOperationRepository
{
    public void AddOperation(WarehouseOperation operation)
        => Add(operation);

    public async Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken ct)
        => await _db.WarehouseOperations
            .AsNoTracking()
            .Include(o => o.Items)
            .SingleOrDefaultAsync(o => o.Id == id, ct);

    public IQueryable<WarehouseOperation> GetOperations()
        => GetAll()
            .AsNoTracking();

    public async Task<IReadOnlyList<WarehouseOperation>> GetOperationsWithItemsAsync(CancellationToken ct)
        => await _db.WarehouseOperations
            .Include(o => o.Items)
            .OrderByDescending(o => o.Date)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<Document>> GetDocumentsAsync(CancellationToken ct)
        => await _db.Documents
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(ct);
}
