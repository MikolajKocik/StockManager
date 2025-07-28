using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Helpers;

namespace StockManager.Infrastructure.Repositories;

public sealed class SupplierRepository : ISupplierRepository
{

    private readonly StockManagerDbContext _dbContext;

    public SupplierRepository(StockManagerDbContext dbcontext)
    {
        _dbContext = dbcontext;
    }

    public IQueryable<Supplier> GetSuppliers()
        => _dbContext.Suppliers
            .AsNoTracking()
            .Include(s => s.Address)
            .Include(s => s.Products);

    public async Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken cancellationToken) 
        => await _dbContext.Suppliers
            .Include(s => s.Address)
            .FirstOrDefaultAsync(s => s.Id == supplierId, cancellationToken);

    public async Task<Supplier?> FindByNameAsync(string name, CancellationToken cancellationToken)
    {
        if(string.IsNullOrWhiteSpace(name))
        {
            return null;
        }

        string normalized = name.Trim().ToUpperInvariant();

        return await _dbContext.Suppliers
            .Where(s => string.Equals(s.Name.ToUpperInvariant(), normalized))
            .FirstOrDefaultAsync(cancellationToken);
    }    
        
    public async Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken)
    {
        return await RepositoryQueriesHelpers.AddEntityAsync(supplier, _dbContext, cancellationToken);
    }

    public async Task<Supplier?> UpdateSupplierAsync(Supplier supplier, ISupplierService supplierService, CancellationToken cancellationToken)
    {
        Supplier? existingSupplier = await _dbContext.Suppliers
            .Include(s => s.Address)
            .FirstOrDefaultAsync(s => s.Id == supplier.Id, cancellationToken);

        if (existingSupplier is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(supplier.Name))
        {
            supplierService.ChangeName(existingSupplier, supplier.Name);
        }

        if (supplier.Address is not null)
        {
            _dbContext.Entry(existingSupplier.Address).CurrentValues.SetValues(supplier.Address);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return existingSupplier;
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
      => await _dbContext.Database.BeginTransactionAsync(cancellationToken);

    public void AttachSupplier(Supplier supplier)
    {
        _dbContext.Suppliers.Attach(supplier);
    }

    public async Task<Supplier?> DeleteSupplierAsync(Supplier supplier, CancellationToken cancellationToken)
    {
        Supplier? supplierExist = await RepositoryQueriesHelpers.EntityFindAsync<Supplier, Guid>(supplier.Id, _dbContext, cancellationToken);

        _dbContext.Suppliers.Remove(supplierExist!);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return supplierExist;
    }
}
