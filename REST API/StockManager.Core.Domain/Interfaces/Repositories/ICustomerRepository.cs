using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;

public interface ICustomerRepository
{
    IQueryable<Customer> GetCustomers();
    Task<Customer?> GetCustomerByIdAsync(int id, CancellationToken cancellationToken = default);
}
