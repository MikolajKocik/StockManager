using System.Linq.Expressions;

namespace StockManager.Application.Abstractions.CQRS.Query.QueryHelpers.Supplier
{
    internal static class SupplierQueries
    {
        public static IQueryable<TEntity> IfHasValue<TEntity>(
            this IQueryable<TEntity> source,
            bool condition,
            Expression<Func<TEntity, bool>> predicate
            ) 
        {
            return condition ? source.Where(predicate) : source;
        }
    }
}
