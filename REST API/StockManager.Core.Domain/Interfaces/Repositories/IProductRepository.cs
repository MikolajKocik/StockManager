using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IProductRepository
{
    IQueryable<Product> GetProducts();
    Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken);
    Task<Product> AddProductAsync(Product product, CancellationToken cancellationToken);
    Task<IDbContextTransaction> BeginTransactionAsync();
    Task<Product?> UpdateProductAsync(
        IProductService productService,
        Product product,
        ISupplierService supplierService,
        CancellationToken cancellationToken);
    Task<Product?> DeleteProductAsync(Product product, CancellationToken cancellationToken);
}
