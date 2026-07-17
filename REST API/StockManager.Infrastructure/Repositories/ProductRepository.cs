using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class ProductRepository(StockManagerDbContext db) 
    : BaseOperations<Product>(db), IProductRepository
{
    public async Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken)
        => await _db.Products
            .Where(x => x.Id == id)
            .Include(s => s.Supplier)
            .ThenInclude(a => a.Address)
            .SingleOrDefaultAsync(cancellationToken);

    public IQueryable<Product> GetProducts()
        => GetAll()
            .AsNoTracking();

    public void AddProduct(Product product)
        => Add(product);

    public async Task<Product?> FindProductByNameAsync(string name, CancellationToken cancellationToken)
        => await _db.Products
            .Where(x => x.Name == name)
            .Include(s => s.Supplier)
            .ThenInclude(a => a.Address)
            .FirstOrDefaultAsync(cancellationToken);
}
