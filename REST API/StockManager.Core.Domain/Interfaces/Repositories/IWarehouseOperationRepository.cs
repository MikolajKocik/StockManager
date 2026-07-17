using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IWarehouseOperationRepository
{
    void AddOperation(WarehouseOperation operation);
    Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<WarehouseOperation>> GetOperationsWithItemsAsync(CancellationToken ct = default);
    IQueryable<Document> GetDocuments();
    IQueryable<WarehouseOperation> GetOperations();
}
