using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Infrastructure.Helpers;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Repositories;

public sealed class CustomerRepository : ICustomerRepository
{
    private readonly StockManagerDbContext _dbContext;

    public CustomerRepository(StockManagerDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<Customer> GetCustomers() => _dbContext.Customers;
    
    public async Task<Customer?> GetCustomerByIdAsync(int id, CancellationToken cancellationToken)
        => await _dbContext.Customers
        .Where(x => x.Id == id)
        .SingleOrDefaultAsync(cancellationToken);

    public async Task<Customer> AddCustomerAsync(Customer customer, CancellationToken cancellationToken)
        => await RepositoryQueriesHelpers.AddEntityAsync(_dbContext, customer, cancellationToken);

    public async Task<Customer> UpdateCustomerAsync(Customer entity, CancellationToken cancellationToken)
    {
        if (_dbContext.Entry(entity).State == EntityState.Detached)
        {
            _dbContext.Customers.Attach(entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }
}
