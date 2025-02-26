using StockManager.Models;

namespace StockManager.Core.Domain.Interfaces
{
    public interface ISupplierRepository
    {
        Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken cancellationToken);
        Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken);
        void AttachSupplier(Supplier supplier);
    }
}
