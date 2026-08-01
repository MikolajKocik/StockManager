using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ISupplierRepository : IBaseRepository
{
    Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken ct = default);
    void AddSupplier(Supplier supplier);
    Task DeleteSupplierAsync(Guid id, CancellationToken ct = default);
    void AttachSupplier(Supplier supplier);
    IQueryable<Supplier> GetSuppliers();
    Task<Supplier?> FindByNameAsync(string name, CancellationToken ct = default);
}
