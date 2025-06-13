using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace StockManager.Infrastructure.Helpers
{
    public class RepositoryQueriesHelpers 
    {
        public static async Task<T> AddEntityAsync<T>(
            T entity,
            DbContext db,
            CancellationToken cancellationToken) where T : class 
        {
            await db.Set<T>().AddAsync(entity);
            await db.SaveChangesAsync(cancellationToken);
            return entity;
        }

        public static async Task<T?> GetEntityWithIncludeAsync<T, TProperty>(
            DbContext db,
            Expression<Func<T, TProperty>> include,
            Expression<Func<T, bool>> predicate,
            CancellationToken cancellation) where T : class
        {
            return await db.Set<T>()
                .Include(include)
                .FirstOrDefaultAsync(predicate, cancellation);
        }

        public static async Task<T?> GetEntityWithNestedIncludeAsync<T, TProperty, TThenProperty>(
            DbContext db,
            Expression<Func<T, TProperty>> include,
            Expression<Func<TProperty, TThenProperty>> thenInclude,
            Expression<Func<T, bool>> predicate,
            CancellationToken cancellation) where T : class
        {
            return await db.Set<T>()
                .Include(include)
                .ThenInclude(thenInclude)
                .FirstOrDefaultAsync(predicate, cancellation);
        }
    }
}
