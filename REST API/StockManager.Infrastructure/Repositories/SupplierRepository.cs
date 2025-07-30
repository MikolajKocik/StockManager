using System.Linq.Expressions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;

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
        => await RepositoryQueriesHelpers.FindByNameAsync<Supplier>(_dbContext, name, cancellationToken);

    public async Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, supplier, cancellationToken);
    

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

    public void AttachSupplier(Supplier supplier)
    {
        _dbContext.Suppliers.Attach(supplier);
    }

    public async Task<Supplier?> DeleteSupplierAsync(Supplier supplier, CancellationToken cancellationToken)
    {
        Supplier? supplierExist = await RepositoryQueriesHelpers.EntityFindAsync<Supplier, Guid>(_dbContext, supplier.Id, cancellationToken);

        _dbContext.Suppliers.Remove(supplierExist!);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return supplierExist;
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
        => Task.FromResult(_dbContext.Database.BeginTransaction());
}
