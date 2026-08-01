using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Interfaces.Common;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface IProductRepository : IBaseRepository
{
    IQueryable<Product> GetProducts();
    Task<Product?> GetProductByIdAsync(int id, CancellationToken cancellationToken);
    void AddProduct(Product product);
    Task<Product?> FindProductByNameAsync(string name, CancellationToken cancellationToken);
}
