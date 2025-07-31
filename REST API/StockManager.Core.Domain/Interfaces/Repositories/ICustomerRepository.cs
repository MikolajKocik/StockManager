using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Core.Domain.Interfaces.Repositories;
public interface ICustomerRepository
{
    IQueryable<Customer> GetCustomers();
    Task<Customer?> GetCustomerByIdAsync(int id, CancellationToken cancellationToken);
    Task<Customer> AddCustomerAsync(Customer entity, CancellationToken ctcancellationToken);
    Task<Customer> UpdateCustomerAsync(Customer entity, CancellationToken cancellationToken);
}
