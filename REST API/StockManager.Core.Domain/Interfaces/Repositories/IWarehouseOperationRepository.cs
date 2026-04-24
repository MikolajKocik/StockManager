using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IWarehouseOperationRepository : IBaseRepository
{
    Task AddAsync(WarehouseOperation operation, CancellationToken cancellationToken);
    Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task UpdateAsync(WarehouseOperation operation, CancellationToken cancellationToken);
    Task<List<WarehouseOperation>> GetOperationsWithItemsAsync(CancellationToken cancellationToken);
    Task<List<Document>> GetDocumentsAsync(CancellationToken cancellationToken);
    IQueryable<WarehouseOperation> GetOperations();
}
