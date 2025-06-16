using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace StockManager.Infrastructure.Helpers
{
    internal sealed class RepositoryQueriesHelpers 
    {
        public static async Task<T> AddEntityAsync<T>(
            T entity,
            DbContext db,
            CancellationToken cancellationToken) where T : class 
        {
            await db.Set<T>().AddAsync(entity, cancellationToken).ConfigureAwait(false);
            await db.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
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
                .FirstOrDefaultAsync(predicate, cancellation).ConfigureAwait(false);
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
                .FirstOrDefaultAsync(predicate, cancellation).ConfigureAwait(false);
        }

        public static async Task<T?> EntityFindAsync<T, I>(
            I id,          
            DbContext db,
            CancellationToken cancellationToken
            ) 
            where T : class
            where I : notnull
        {
            return await db.Set<T>()
                .FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
        }
    }
}
