﻿using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Helpers;
using StockManager.Models;
using System.Linq.Expressions;

namespace StockManager.Infrastructure.Repositories
{
    public sealed class SupplierRepository : ISupplierRepository
    {

        private readonly StockManagerDbContext _dbContext;

        public SupplierRepository(StockManagerDbContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public async Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken cancellationToken)
        {
            Expression<Func<Supplier, bool>> predicate = s => s.Id == supplierId;

            return await RepositoryQueriesHelpers.GetEntityWithIncludeAsync(_dbContext, s => s.Address, predicate, cancellationToken);
        }

        public async Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken)
        {
            return await RepositoryQueriesHelpers.AddEntityAsync(supplier, _dbContext, cancellationToken);
        }

        public void AttachSupplier(Supplier supplier)
        {
            _dbContext.Suppliers.Attach(supplier);
        }
    }
}
