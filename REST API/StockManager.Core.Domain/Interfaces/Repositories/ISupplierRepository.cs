using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ISupplierRepository
{
    Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken cancellationToken);
    Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken);
    Task<Supplier?> UpdateSupplierAsync(Supplier supplier, ISupplierService supplierService, CancellationToken cancellationToken);
    Task<Supplier?> DeleteSupplierAsync(Supplier supplier, CancellationToken cancellationToken);
    void AttachSupplier(Supplier supplier);
    IQueryable<Supplier> GetSuppliers();
    Task<IDbContextTransaction> BeginTransactionAsync();
    Task<Supplier?> FindByNameAsync(string name, CancellationToken cancellationToken);
}
