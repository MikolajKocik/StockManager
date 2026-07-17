using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ISupplierRepository : IBaseRepository
{
    Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken ct = default);
    void AddSupplier(Supplier supplier);
    Task DeleteSupplierAsync(int id, CancellationToken ct = default);
    void AttachSupplier(Supplier supplier);
    IQueryable<Supplier> GetSuppliers();
    Task<Supplier?> FindByNameAsync(string name, CancellationToken ct = default);
}
