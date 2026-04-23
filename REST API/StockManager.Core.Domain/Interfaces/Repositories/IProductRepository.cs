using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Interfaces.Repositories.BaseRepository;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IProductRepository : IBaseRepository
{
    IQueryable<Product> GetProducts();
    Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken);
    Task<Product> AddProductAsync(Product product, CancellationToken cancellationToken);
    Task<Product?> UpdateProductAsync(
        IProductService productService,
        Product product,
        ISupplierService supplierService,
        CancellationToken cancellationToken);
    Task<Product?> FindProductByNameAsync(string name, CancellationToken cancellationToken);
}
