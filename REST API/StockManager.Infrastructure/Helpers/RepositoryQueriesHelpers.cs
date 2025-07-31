using System;
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Helpers;

internal sealed class RepositoryQueriesHelpers 
{
    /// <summary>
    /// Asynchronously adds a new entity to the database context and saves the changes.
    /// </summary>
    /// <remarks>This method adds the specified entity to the database context and persists the changes by
    /// calling <see cref="Microsoft.EntityFrameworkCore.DbContext.SaveChangesAsync(CancellationToken)"/>.</remarks>
    /// <typeparam name="T">The type of the entity to add. Must be a reference type.</typeparam>
    /// <param name="_dbContext">The database context to which the entity will be added. Cannot be null.</param>
    /// <param name="entity">The entity to add to the database. Cannot be null.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the added entity.</returns>
    public static async Task<T> AddEntityAsync<T>(
        StockManagerDbContext _dbContext,
        T entity,
        CancellationToken cancellationToken) where T : class 
    {
        await _dbContext.Set<T>().AddAsync(entity, cancellationToken).ConfigureAwait(false);
        await _dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return entity;
    }

    /// <summary>
    /// Asynchronously retrieves an entity of the specified type by its primary key.
    /// </summary>
    /// <typeparam name="T">The type of the entity to retrieve. Must be a reference type.</typeparam>
    /// <typeparam name="I">The type of the primary key. Must be non-nullable.</typeparam>
    /// <param name="dbContext">The database context used to query the entity.</param>
    /// <param name="id">The primary key value of the entity to retrieve. Cannot be null.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The entity of type <typeparamref name="T"/> if found; otherwise, <see langword="null"/>.</returns>
    public static async Task<T?> EntityFindAsync<T, I>(
        StockManagerDbContext dbContext,
        I id,          
        CancellationToken cancellationToken
        ) 
        where T : class
        where I : notnull
    {
        return await dbContext.Set<T>()
            .FindAsync(new object[] { id }, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>
    /// Asynchronously finds an entity of the specified type by its name in the database.
    /// </summary>
    /// <remarks>This method uses SQL Server's <c>LIKE</c> operator for name matching, which may behave
    /// differently on other database providers. The query is executed with no tracking, meaning the returned entity is
    /// not tracked by the context.</remarks>
    /// <typeparam name="T">The type of the entity to search for. Must be a reference type.</typeparam>
    /// <param name="dbContext">The <see cref="StockManagerDbContext"/> instance used to query the database. Cannot be <c>null</c>.</param>
    /// <param name="name">The name of the entity to search for. The search is case-insensitive and trims leading and trailing whitespace.
    /// If <paramref name="name"/> is <c>null</c>, the method returns <c>null</c>.</param>
    /// <param name="cancellationToken">A <see cref="CancellationToken"/> to observe while waiting for the task to complete.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains the first entity of type
    /// <typeparamref name="T"/>  with a matching name, or <c>null</c> if no match is found.</returns>
    public static async Task<T?> FindByNameAsync<T>(
        StockManagerDbContext dbContext,
        string name, 
        CancellationToken cancellationToken)
    where T : class
    {
        if (name is null)
        {
            return null;
        }

        string normalized = name.ToString()!.Trim();

        return await dbContext.Set<T>()
            .AsNoTracking()
            .FirstOrDefaultAsync(
            // only work good for sql server 'Like'
                e => EF.Functions.Like(
                    EF.Property<string>(e, "Name"),
                    name),
                cancellationToken)
            .ConfigureAwait(false);
    }
}
