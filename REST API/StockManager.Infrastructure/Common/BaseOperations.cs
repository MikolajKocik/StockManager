using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Common;

internal abstract class BaseOperations<T>(StockManagerDbContext db) where T : class
{
    protected readonly StockManagerDbContext _db = db;

    protected void Add(T entity) => _db.Set<T>().Add(entity);
    protected IQueryable<T> GetAll() => _db.Set<T>();
    protected void Delete(T entity) => _db.Set<T>().Remove(entity);
}