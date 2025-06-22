using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Models;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ISupplierRepository
{
    Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken cancellationToken);
    Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken);
    Task<Supplier?> UpdateSupplierAsync(Supplier supplier, CancellationToken cancellationToken);
    Task<Supplier?> DeleteSupplierAsync(Supplier supplier, CancellationToken cancellationToken);
    void AttachSupplier(Supplier supplier);
    IQueryable<Supplier> GetSuppliers();
    Task<IDbContextTransaction> BeginTransactionAsync();
}
