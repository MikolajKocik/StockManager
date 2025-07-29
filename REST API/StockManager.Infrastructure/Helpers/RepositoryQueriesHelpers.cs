using System;
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using StockManager.Core.Domain.Models.SupplierEntity;
using StockManager.Infrastructure.Data;

namespace StockManager.Infrastructure.Helpers;

internal sealed class RepositoryQueriesHelpers 
{
    public static async Task<T> AddEntityAsync<T>(
        StockManagerDbContext _dbContext,
        T entity,
        CancellationToken cancellationToken) where T : class 
    {
        await _dbContext.Set<T>().AddAsync(entity, cancellationToken).ConfigureAwait(false);
        await _dbContext.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return entity;
    }

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
