using StockManager.Models;

namespace StockManager.Core.Domain.Interfaces
{
    public interface IProductRepository
    {
        IQueryable<Product> GetProducts();

        Task <Product?> GetProductById(int id, CancellationToken cancellationToken);
    }
}
