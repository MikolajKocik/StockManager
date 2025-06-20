using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Models;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IProductRepository
{
    IQueryable<Product> GetProducts();
    Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken);
    Task<Product> AddProductAsync(Product product, CancellationToken cancellationToken);
    Task<IDbContextTransaction> BeginTransactionAsync();
    Task<Product?> UpdateProductAsync(Product product, CancellationToken cancellationToken);
    Task<Product?> DeleteProductAsync(Product product, CancellationToken cancellationToken);
}
