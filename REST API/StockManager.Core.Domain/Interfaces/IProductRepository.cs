using StockManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Core.Domain.Interfaces
{
    public interface IProductRepository
    {
        IQueryable<Product> GetProducts();

        Task <Product?> GetProductById(int id, CancellationToken cancellationToken);
    }
}
