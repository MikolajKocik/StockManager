using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class SupplierRepository(StockManagerDbContext db)
    : BaseOperations<Supplier>(db), ISupplierRepository
{
    public IQueryable<Supplier> GetSuppliers()
        => GetAll()
            .AsNoTracking()
            .Include(s => s.Address)
            .Include(s => s.Products);

    public async Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken ct)
        => await _db.Suppliers
            .Include(s => s.Address)
            .SingleOrDefaultAsync(s => s.Id == supplierId, ct);

    public async Task<Supplier?> FindByNameAsync(string name, CancellationToken ct)
        => await _db.Suppliers
            .Include(s => s.Address)
            .FirstOrDefaultAsync(s => s.Name == name, ct);

    public void AddSupplier(Supplier supplier)
        => Add(supplier);

    public void AttachSupplier(Supplier supplier)
    {
        _db.Suppliers.Attach(supplier);
    }

    public async Task DeleteSupplierAsync(Guid id, CancellationToken ct)
    {
        Supplier supplierExist = await _db.Suppliers.FindAsync([id], ct)
            ?? throw new InvalidOperationException($"Supplier with id {id} not found.");
        Delete(supplierExist);
    }
}
