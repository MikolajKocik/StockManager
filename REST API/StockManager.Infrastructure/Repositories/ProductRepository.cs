using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Helpers;
using StockManager.Models;
using System.Linq.Expressions;

namespace StockManager.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly StockManagerDbContext _dbContext;

        public ProductRepository(StockManagerDbContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public IQueryable<Product> GetProducts()
            => _dbContext.Products
                    .AsNoTracking()
                    .Include(s => s.Supplier)
                    .ThenInclude(a => a.Address);

        public async Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken)
        {
            Expression<Func<Product, bool>> predicate = p => p.Id == id;

            return await RepositoryQueriesHelpers.GetEntityWithNestedIncludeAsync(
                _dbContext, s => s.Supplier, a => a.Address, predicate, cancellationToken);
        }

        public async Task<Product> AddProductAsync(Product product, CancellationToken cancellationToken)
        {
            return await RepositoryQueriesHelpers.AddEntityAsync(product, _dbContext, cancellationToken);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
            => await _dbContext.Database.BeginTransactionAsync();

        public async Task<Product?> UpdateProductAsync(Product product, CancellationToken cancellationToken)
        {
            // I attach the entity to EF and force a full update - without downloading the original from the database
            _dbContext.Attach(product);
            _dbContext.Entry(product).State = EntityState.Modified;

            if (product.Supplier is not null)
            {
                // Try to load the existing supplier with the same ID from the database
                var existingSupplier = await _dbContext.Suppliers
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(s => s.Id == product.SupplierId, cancellationToken);

                if (existingSupplier is not null)
                {
                    // Assign the existing supplier entity to preserve tracking and FK integrity
                    product.SetSupplier(existingSupplier); 

                    if (product.Supplier?.Name is not null)
                    {
                        existingSupplier.ChangeName(product.Supplier.Name);
                    }

                    if (product.Supplier?.Address is not null)
                    {
                        // Update supplier's address fields if they were provided by the client
                        _dbContext.Entry(existingSupplier.Address).CurrentValues.SetValues(product.Supplier.Address);
                    }
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return product;
        }

        public async Task<Product?> DeleteProductAsync(Product product, CancellationToken cancellationToken)
        {
            var productExist = await RepositoryQueriesHelpers.EntityFindAsync<Product, int>(product.Id, _dbContext, cancellationToken);

            _dbContext.Products.Remove(productExist!);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return productExist;
        }
    }
}
