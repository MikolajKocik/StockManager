using Microsoft.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces;
using StockManager.Infrastructure.Data;
using StockManager.Models;

namespace StockManager.Infrastructure.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {

        private readonly StockManagerDbContext _dbContext;

        public SupplierRepository(StockManagerDbContext dbcontext)
        {
            _dbContext = dbcontext;
        }

        public async Task<Supplier?> GetSupplierByIdAsync(Guid? supplierId, CancellationToken cancellationToken)
            => await _dbContext.Suppliers
                .AsNoTracking()
                .Include(s => s.Address)
                .FirstOrDefaultAsync(s => s.Id == supplierId, cancellationToken);


        public async Task<Supplier> AddSupplierAsync(Supplier supplier, CancellationToken cancellationToken)
        {
            _dbContext.Suppliers.Add(supplier);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return supplier;
        }
    }
}
