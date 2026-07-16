using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IWarehouseOperationRepository
{
    void AddOperation(WarehouseOperation operation);
    Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<WarehouseOperation>> GetOperationsWithItemsAsync(CancellationToken ct = default);
    Task<IReadOnlyList<Document>> GetDocumentsAsync(CancellationToken ct = default);
    IQueryable<WarehouseOperation> GetOperations();
}
