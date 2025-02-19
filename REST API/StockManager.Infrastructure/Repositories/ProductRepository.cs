using Microsoft.EntityFrameworkCore;
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
            => _dbContext.Products;
    }
}
