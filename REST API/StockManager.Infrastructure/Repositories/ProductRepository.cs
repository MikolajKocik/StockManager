using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces;
using StockManager.Infrastructure.Data;
using StockManager.Models;

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
            => await _dbContext.Products
                .AsNoTracking()
                .Include(s => s.Supplier)
                .ThenInclude(a => a.Address) 
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        public async Task<Product> AddProductAsync(Product product, CancellationToken cancellationToken)
        {
            await _dbContext.Products
                .AddAsync(product, cancellationToken);
            _dbContext.SaveChanges();
            return product;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
            => await _dbContext.Database.BeginTransactionAsync();

        public async Task<Product?> UpdateProductAsync(Product product, CancellationToken cancellationToken)
        {
            var existingProduct = await _dbContext.Products.FindAsync(new object[] {product.Id}, cancellationToken);

            if (existingProduct == null)
            {
                throw new KeyNotFoundException("Product with provided id not found");
            }

            _dbContext.Entry(existingProduct).CurrentValues.SetValues(product);
            await _dbContext.SaveChangesAsync(cancellationToken); 
            return existingProduct;
        }

        public async Task<Product?> DeleteProductAsync(Product product, CancellationToken cancellationToken)
        {
            var productExist = await _dbContext.Products.FindAsync(new object[] { product.Id }, cancellationToken);

            if(productExist == null)
            {
                throw new KeyNotFoundException("Product with provided id not found");
            }

            _dbContext.Products.Remove(productExist);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return productExist;
        }
    }
}
