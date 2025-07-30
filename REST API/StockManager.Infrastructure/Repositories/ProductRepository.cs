using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;
using System.Linq.Expressions;

namespace StockManager.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly StockManagerDbContext _dbContext;

    public ProductRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private static readonly Func<StockManagerDbContext, int, CancellationToken, Task<Product?>> GetProductByIdCompiled =
        EF.CompileAsyncQuery((StockManagerDbContext dbContext, int id, CancellationToken cancellationToken) =>
            dbContext.Products
                    .IgnoreQueryFilters()
                    .Include(s => s.Supplier)
                    .ThenInclude(a => a.Address)
                    .FirstOrDefault(p => p.Id == id));

    public async Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken)
        => await GetProductByIdCompiled(_dbContext, id, cancellationToken);

    public IQueryable<Product> GetProducts()
        => _dbContext.Products
                .AsNoTracking()
                .Include(s => s.Supplier)
                .ThenInclude(a => a.Address);

    public async Task<Product> AddProductAsync(Product product, CancellationToken cancellationToken)
            => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, product, cancellationToken);

    public async Task<Product?> FindProductByNameAsync(string name, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.FindByNameAsync<Product>(_dbContext, name, cancellationToken);

    public async Task<Product?> UpdateProductAsync(
        IProductService productService,
        Product product,
        ISupplierService supplierService,
        CancellationToken cancellationToken)
    {
        // Attach the entity to EF and force a full update - without downloading the original from the database
        _dbContext.Attach(product);
        _dbContext.Entry(product).State = EntityState.Modified;

        if (product.Supplier is not null)
        {
            // Try to load the existing supplier with the same ID from the database
            Supplier existingSupplier = await _dbContext.Suppliers
                .Include(a => a.Address)
                .FirstOrDefaultAsync(s => s.Id == product.SupplierId, cancellationToken);

            if (existingSupplier is not null)
            {
                // Assign the existing supplier entity to preserve tracking and FK integrity
                productService.SetSupplier(product, existingSupplier);

                if (product.Supplier?.Name is not null)
                {
                    supplierService.ChangeName(existingSupplier, product.Supplier.Name);
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

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
        => Task.FromResult(_dbContext.Database.BeginTransaction());
}
