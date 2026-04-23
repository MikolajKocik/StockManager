using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public class WarehouseOperationRepository : IWarehouseOperationRepository
{
    private readonly StockManagerDbContext _context;

    public WarehouseOperationRepository(StockManagerDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(WarehouseOperation operation, CancellationToken cancellationToken)
    {
        await _context.WarehouseOperations.AddAsync(operation, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.WarehouseOperations
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    public async Task UpdateAsync(WarehouseOperation operation, CancellationToken cancellationToken)
    {
        _context.WarehouseOperations.Update(operation);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<WarehouseOperation>> GetOperationsWithItemsAsync(CancellationToken cancellationToken)
    {
        return await _context.WarehouseOperations
            .Include(o => o.Items)
            .OrderByDescending(o => o.Date)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Document>> GetDocumentsAsync(CancellationToken cancellationToken)
    {
        return await _context.Documents
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
        => await _context.Database.BeginTransactionAsync(cancellationToken);
}
