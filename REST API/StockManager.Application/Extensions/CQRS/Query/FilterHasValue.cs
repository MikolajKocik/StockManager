using System.Linq.Expressions;

namespace StockManager.Application.Extensions.CQRS.Query;

internal static class FilterHasValue
{
    /// <summary>
    /// Conditionally applies a filter to the queryable source based on the specified condition.
    /// </summary>
    /// <typeparam name="TEntity">The type of the elements in the queryable source.</typeparam>
    /// <param name="source">The queryable source to which the filter may be applied. Cannot be <see langword="null"/>.</param>
    /// <param name="condition">A boolean value indicating whether the filter should be applied.  If <see langword="true"/>, the <paramref
    /// name="predicate"/> is applied; otherwise, the source is returned unchanged.</param>
    /// <param name="predicate">An expression representing the filter to apply to the source.  This is only used if <paramref name="condition"/>
    /// is <see langword="true"/>. Cannot be <see langword="null"/> if the condition is <see langword="true"/>.</param>
    /// <returns>The filtered queryable source if <paramref name="condition"/> is <see langword="true"/>;  otherwise, the
    /// original queryable source.</returns>
    public static IQueryable<TEntity> IfHasValue<TEntity>(
        this IQueryable<TEntity> source,
        bool condition,
        Expression<Func<TEntity, bool>> predicate
        ) 
    {
        return condition ? source.Where(predicate) : source;
    }
}
