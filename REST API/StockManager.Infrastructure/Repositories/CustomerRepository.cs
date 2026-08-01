using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Infrastructure.Common;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

internal sealed class CustomerRepository(StockManagerDbContext db) 
    : BaseOperations<Customer>(db), ICustomerRepository
{
    public IQueryable<Customer> GetCustomers() 
        => GetAll()
            .AsNoTracking();

    public async Task<Customer?> GetCustomerByIdAsync(int id, CancellationToken cancellationToken)
        => await _db.Customers
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync(cancellationToken);

    public void AddCustomer(Customer customer)
        => Add(customer);
}
