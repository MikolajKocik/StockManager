using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ICustomerRepository : IBaseRepository
{
    IQueryable<Customer> GetCustomers();
    Task<Customer?> GetCustomerByIdAsync(int id, CancellationToken cancellationToken = default);
}
