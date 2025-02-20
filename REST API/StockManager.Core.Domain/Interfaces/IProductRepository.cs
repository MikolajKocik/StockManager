using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Models;

namespace StockManager.Core.Domain.Interfaces
{
    public interface IProductRepository
    {
        IQueryable<Product> GetProducts();

        Task <Product?> GetProductById(int id, CancellationToken cancellationToken);

        Task<Product> AddProduct(Product product, CancellationToken cancellationToken);

        Task<IDbContextTransaction> BeginTransaction();
    }
}
