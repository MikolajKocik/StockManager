using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IWarehouseOperationRepository : IBaseRepository
{
    void AddOperation(WarehouseOperation operation);
    Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<WarehouseOperation>> GetOperationsWithItemsAsync(CancellationToken ct = default);
    IQueryable<Document> GetDocuments();
    IQueryable<WarehouseOperation> GetOperations();
}
