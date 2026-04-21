using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IWarehouseOperationRepository
{
    Task AddAsync(WarehouseOperation operation, CancellationToken cancellationToken);
    Task<WarehouseOperation?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task UpdateAsync(WarehouseOperation operation, CancellationToken cancellationToken);
}
