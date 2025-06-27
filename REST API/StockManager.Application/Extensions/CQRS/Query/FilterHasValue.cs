using System.Linq.Expressions;

namespace StockManager.Application.Extensions.CQRS.Query;

internal static class FilterHasValue
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
